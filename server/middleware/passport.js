const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const config = require('../config');
const Users = require('../models/users');

const options = {
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.TOKEN_USER_SECRET_KEY
};

module.exports = (passport) => {
    passport.use(
        new jwtStrategy(options, async (payload, done) => {
            const user = await Users.Instance.findById(payload.userId).select('userEmail id');
            try {
                if (user) {
                    done(null, user);
                } else {
                    done(null, false)
                }
            } catch (e) {
                console.log(e);
            }
        })
    )
};