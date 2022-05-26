const greetingService       = require('../services/greeting.service');
const { to, ReE, ReS }  = require('../services/util.service');

const update = async function(req, res){
    let err, greeting;
    const data = req.body;
    [err, greeting] = await to(greetingService.updateGreeting(data));
    if(err) return ReE(res, err.message, 422);    
    return ReS(res, {message:'Success to update greeting.', greeting:greeting.getText()}, 200);
}
module.exports.update = update;
