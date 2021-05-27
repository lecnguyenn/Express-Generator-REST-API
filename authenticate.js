var passport = require('passport');
var localStrtegy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStratery = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var FaceboojTokenStrategy = require('passport-facebook-token');

var config = require('./config');

exports.local = passport.use(new localStrtegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.getToken = function(user){
    return jwt.sign(user, config.secretKey,
        {expiresIn:3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;


exports.jwtPassport = passport.use(new JwtStratery(opts,
    function(jwt_payload, done){
        console.log("JWT_payload: ",jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err,user) =>{
            if(err) {
                return done(err, false);
            }
            else if(user) {
                return done(null,user);
            }
            else{
                return done(null, false);
            }
        })
    }));

// exports.verifyUser = function(req,res,next){
//     var token = req.body.token || req.query.token || req.headers['x-access-token'];
//     if(token) {
//         jwt.verify(token, config.secretKey, (err, decode) =>{
//             if(err){
//                 var err = new Error('You are not authenticated!');
//                 err.status = 401;
//                 return next(err);
//             }
//             else{
//                 req.decode = decode;
//                 next();
//             }
//         });
//     }
//     else{
//         var err = new Error('No token provied');
//         err.status = 403;
//         return next(err);
//     }

// }
exports.verifyUser = passport.authenticate('jwt', {session: false});
exports.verifyAdmin = function(req, res, next){
    if(req.user.admin){
        next();
    }
    else{
        var err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
    }
}
exports.FacebookPassport = passport.use( new FaceboojTokenStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret
},(accessToken, refreshToken, profile, done) =>{
    User.findOne({ facebookId: profile.id}, (err, user)=>{
        if(err){
            return done(err, false);
        }
        if(!err && user !== null){
            return done(null, user);
        }
        else{
            user = new User({ username: profile.displayName});
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((err, user) =>{
                if(err){
                    return done(err, false);
                }
                else{
                    return done(null, user);
                }
            })
        }
    }
    
    )
}

))
