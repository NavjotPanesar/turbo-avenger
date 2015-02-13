var express = require('express');
var app = module.exports = express();
var config = require('../../env.json')[process.env.NODE_ENV || 'development'];

var mongoose = require('mongoose');
var User = require('../user.model.js');

 var passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
app.use(passport.initialize());
app.use(passport.session()); 
	
app.get('/', function(req, res) {
	if(req.session.user ){
		res.send('valid');
	} else {
		res.send('invalid');
	}
});
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACK_URL,
        passReqToCallback: true
    },
    function(request, accessToken, refreshToken, profile, done) {
		User.findOrCreate(
		{_id: profile.id},
		{
			imageUrl: profile._json.picture,
			name: profile._json.name
		}, function(err, user, created) {
			console.log(user);
			console.log('user auth');
			console.log(profile._json);
			request.session.user = user;
			return done(err, user);
		});
    }
));


app.get('/google',
    passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.login', , 'https://www.googleapis.com/auth/plus.profile.emails.read']
    }));

app.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/auth/google/failure'
    }));