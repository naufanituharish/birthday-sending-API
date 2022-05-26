const { User, Schedule} = require('../models');
const Greeting      = require('./greeting.service');
const axios         = require('axios').default;
const moment        = require('moment-timezone');
const { to, TE }    = require('../services/util.service');
const CONFIG        = require('../config/config');
const { Op }        = require("sequelize");

const createSchedule = async (user) => {
    let err, res, status = 'pending', lastInvoke;
    let serverTimeZone = moment.tz.guess();
    let now = moment();
    let userDoB = moment(user.dob, "YYYY-MM-DD");
    let invokeDate = moment.tz(now, serverTimeZone).format('YYYY')+"-"+userDoB.format('MM')+"-"+userDoB.format('DD');
    invokeDate = moment.tz(invokeDate+' 09:00:00',user.location)
    // convert Invoke Date To Server Timezone
    invokeDate = moment.tz(invokeDate,serverTimeZone);
    [err, res] = await to(Schedule.create({
        model_id : user.id,
        invoke_date : invokeDate.format("YYYY-MM-DD"),
        invoke_time : invokeDate.format('HH:mm:ss'),
        status : status,
        last_invoke : lastInvoke,
    }));
    if(err) TE(err.message);
    // check are user's birt day same as today and after 9AM if so send notification email
    if(moment.tz(now, serverTimeZone).format("YYYY-MM-DD") == (invokeDate.format("YYYY-MM-DD")) 
        && moment.tz(now, serverTimeZone).isSameOrAfter(invokeDate)){
        [err, res] = await to(executeSchedule(user, res)); 
        if(err) TE(err.message);
    }
    return res;
}
module.exports.createSchedule = createSchedule;

const findSchedule = async (id) => {
    let err, res;
    [err, res] = await to(Schedule.findByPk(id));
    if(err) TE(err.message);
    return res;
}
module.exports.findSchedule = findSchedule;

const updateSchedule = async (user) => {
    let err, res, lastInvoke, schedule;
    let serverTimeZone = moment.tz.guess();
    let now = moment();
    [err, schedule] = await to(Schedule.findOne({ where: { model_id: user.id } }));
    if(err) TE(err.message);
    let userDoB = moment(user.dob, "YYYY-MM-DD");
    let invokeDate = moment.tz(now, serverTimeZone).format('YYYY')+"-"+userDoB.format('MM')+"-"+userDoB.format('DD');
    invokeDate = moment.tz(invokeDate+' 09:00:00',user.location);
    // convert Invoke Date To Server Timezone
    invokeDate = moment.tz(invokeDate,serverTimeZone);
    lastInvoke = schedule.last_invoke;

    // check if schedule has been invoke today
    let shouldInvoke = lastInvoke == null ? true : !moment.tz(now, serverTimeZone).isSame((moment(lastInvoke).format('YYYY-MM-DD')));

    [err, res] = await to(schedule.update({
        invoke_date : invokeDate.format("YYYY-MM-DD"),
        invoke_time : invokeDate.format('HH:mm:ss'),
    }));
    if(err) TE(err.message);

    // check are user's birt day same as today and after 9AM if so send notification email
    if(moment.tz(now, serverTimeZone).format("YYYY-MM-DD") == (invokeDate.format("YYYY-MM-DD")) && 
        moment().isSameOrAfter(invokeDate) && shouldInvoke){
        [err, res] = await to(executeSchedule(user, schedule)); 
        if(err) TE(err.message);
    }
    return res;
}
module.exports.updateSchedule = updateSchedule;

const deleteSchedule = async (user) => {
    let err, res, schedule;
    [err, schedule] = await to(Schedule.findOne({ where: { model_id: user.id } }));
    if(err) TE(err.message);
    [err, res] = await to(schedule.destroy());
    if(err) TE(err.message);
    return res;
}
module.exports.deleteSchedule = deleteSchedule;

const executeSchedule = async (user, schedule) => {
    let err, res, greeting;
    let serverTimeZone = moment.tz.guess();
    let now = moment();

    // check only run that has error where has same day as today
    // because different day is not a birth day :)
    if(schedule.status == 'error' && 
        schedule.invoke_date != moment.tz(now, serverTimeZone).format('YYYY-MM-DD')){
            // reset status to pending to next inocation
            let invokeDate = moment(schedule.invoke_date);
            schedule.status = 'pending';
            schedule.invoke_date = invokeDate.add(1, 'years').format("YYYY-MM-DD");
    }else if(schedule.status == 'pending' && moment.tz(now, serverTimeZone).isBefore(schedule.invoke_date)){
        let invokeDate = moment(schedule.invoke_date);
        schedule.invoke_date = invokeDate.add(1, 'years').format("YYYY-MM-DD");
    }
    else{
        [err, greeting] = await to(Greeting.findGreeting());
        if(err) TE(err.message);
        let data = {
            message: "Hi, "+ user.first_name + ' ' + user.last_name + ' ' + greeting.getText()
        }
        const instance = axios.create({
            baseURL: 'https://hookb.in',
        });
        schedule.status = 'processing';
        [err, schedule] = await to(schedule.save());
        if(err) TE(err.message);
        [err, res] = await to(instance.post(CONFIG.hokbin_url,data));
        
        schedule.last_invoke = moment.tz(now, serverTimeZone).format('YYYY-MM-DD HH:mm:ss');
        if(err) {
            TE(err.message);
            // error -> status to erro waiting next hour to invoke
            schedule.status = 'error';
        }
        else{
            let invokeDate = moment(schedule.invoke_date);
            schedule.status = 'pending';
            schedule.invoke_date = invokeDate.add(1, 'years').format("YYYY-MM-DD");
        }
    }

    [err, res] = await to(schedule.save());
    if(err) TE(err.message);
    return res;
}
module.exports.executeSchedule = executeSchedule;

const checkingSchedule = async () => {
    let err, schedules;
    let serverTimeZone = moment.tz.guess();
    let now = moment();

    [err, schedules] = await to(Schedule.findAll({
        where: {
            [Op.or]: [
                {
                    [Op.and]: [
                        { invoke_date: { 
                            [Op.or]: [ 
                                moment.tz(now, serverTimeZone).format('YYYY-MM-DD'), 
                                {
                                    [Op.lt]: moment.tz(now, serverTimeZone).format('YYYY-MM-DD')
                                }
                            ] }
                        },
                        { invoke_time: moment.tz(now, serverTimeZone).format('HH:mm:ss') }
                    ]
                },
                { status: { [Op.or]: [ 'error', 'processing'] } }
            ],
            
        }
    }));
    if(err) TE(err.message);
    schedules.forEach(async (schedule) => {
        let user;
        [err, user] = await to(User.findByPk(schedule.model_id));
        if(err) TE(err.message);
        [err, res] = await to(executeSchedule(user, schedule)); 
        if(err) TE(err.message);
    });
}
module.exports.checkingSchedule = checkingSchedule;