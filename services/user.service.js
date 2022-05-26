const User          = require('../models').User;
const scheduleService = require('./schedule.service');
const { to, TE }    = require('../services/util.service');

const createUser = async (data) => {
    let err, user, schedule;
    [err, user] = await to(User.create(data));
    if(err) TE(err.message);
    [err, schedule] = await to(scheduleService.createSchedule(user));
    if(err) TE(err.message);
    return user;
}
module.exports.createUser = createUser;

const findUser = async (id) => {
    let err, user;
    [err, user] = await to(User.findByPk(id));
    if(err) TE(err.message);
    return user;
}
module.exports.findUser = findUser;

const updateUser = async (user,data) => {
    let err, schedule, updateSchedule = false;
    if(user.dob != data.dob || user.location != data.location) updateSchedule = true;
    [err, user] = await to(user.update(data));
    if(err) TE(err.message);
    if(updateSchedule) [err, schedule] = await to(scheduleService.updateSchedule(user));
    if(err) TE(err.message);
    return user;
}
module.exports.updateUser = updateUser;

const deleteUser = async (data) => {
    let err, user, schedule;
    [err, user] = await to(data.destroy());
    if(err) TE(err.message);
    [err, schedule] = await to(scheduleService.deleteSchedule(user));
    if(err) TE(err.message);
    return user;
}
module.exports.deleteUser = deleteUser;

const userList = async () => {
    let err, users;
    [err, users] = await to(User.findAll());
    if(err) TE(err.message);
    return users;
}
module.exports.userList = userList;

