const userService       = require('../services/user.service');
const { to, ReE, ReS }  = require('../services/util.service');

const create = async function(req, res){
    const data = req.body;
    let err, user;
    [err, user] = await to(userService.createUser(data));
    if(err) return ReE(res, err.message, 422);
    return ReS(res, {message:'Success to register user.', user:user.userData()}, 201);
}
module.exports.create = create;

const get = async function(req, res){
    let err, user;
    let user_id = req.headers.id;
    if(!user_id) return ReE(res, "User ID is required");
    [err, user] = await to(userService.findUser(user_id));
    if(err) return ReE(res, err.message, 422);
    if(!user) return ReE(res, {message:'User not found!.'}, 404);
    return ReS(res, {user:user.userData()}, 200);
}
module.exports.get = get;

const list = async function(req, res){
    let err, users;
    [err, users] = await to(userService.userList());
    if(err) return ReE(res, err.message, 422);
    if(users.length) return ReS(res, {users:users}, 200);
    return ReS(res, {message:'No user data.'}, 200);
    
}
module.exports.list = list;

const update = async function(req, res){
    let err, user;
    let user_id = req.headers.id;
    const data = req.body;
    if(!user_id) return ReE(res, "User ID is required");
    [err, user] = await to(userService.findUser(user_id));
    if(err) return ReE(res, err.message, 422);    
    if(!user) return ReE(res, {message:'User not found!.'}, 404);
    [err, updatedUser] = await to(userService.updateUser(user, data));
    if(err) return ReE(res, err.message, 422);
    return ReS(res, {message:'Success to update user data.', user:updatedUser.userData()}, 200);
}
module.exports.update = update;

const remove = async function(req, res){
    let err, user;
    let user_id = req.headers.id;
    if(!user_id) return ReE(res, "User ID is required");
    [err, user] = await to(userService.findUser(user_id));
    if(err) return ReE(res, err.message, 422);    
    if(!user) return ReE(res, {message:'User not found!.'}, 404);
    [err, deletedUser] = await to(userService.deleteUser(user));
    if(err) return ReE(res, err.message, 422);
    return ReS(res, {message:'Success to delete user.'}, 200);
}
module.exports.remove = remove;