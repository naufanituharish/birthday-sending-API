const { ExtractJwt, Strategy }  = require('passport-jwt');
const CONFIG                    = require('../config/config');
const {to}                      = require('../services/util.service');

module.exports = function(passport){
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = CONFIG.jwt_encryption;

    passport.use(new Strategy(opts, async function(jwt_payload, done){
        // encryption logic
        // do passport encryption logic here
        return done(false, null)
    }));
}