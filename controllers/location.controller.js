const moment = require('moment-timezone');
const { ReS }  = require('../services/util.service');

const list = async function(req, res){
    return ReS(res, {message:'Location list.', locations: moment.tz.names()}, 201);
}
module.exports.list = list;
