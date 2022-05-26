const Greeting          = require('../models').Greeting;
const { to, TE }    = require('../services/util.service');

const seedGreeting = async (data) => {
    let err, res;
    [err, res] = await to(Greeting.findByPk(1));
    if(err) TE(err.message);
    if(!res) [err, res] = await to(Greeting.create(data));
    if(err) TE(err.message);
    return res;
}
module.exports.seedGreeting = seedGreeting;

const findGreeting = async () => {
    let err, res;
    [err, res] = await to(Greeting.findByPk(1));
    if(err) TE(err.message);
    return res;
}
module.exports.findGreeting = findGreeting;

const updateGreeting = async (data) => {
    let err, res, greeting;
    greeting = await to(findGreeting());
    if(err) TE(err.message);
    [err, res] = await to(greeting.update(data));
    if(err) TE(err.message);
    return res;
}
module.exports.updateGreeting = updateGreeting;