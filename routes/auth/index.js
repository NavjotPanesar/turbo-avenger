var express = require('express');
var app = module.exports = express();

var mongoose = require('mongoose');
var User = require('../user.model.js');

 var passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
app.use(passport.initialize());
app.use(passport.session()); 
	
app.get('/', function(req, res) {
    res.send('auth');
});

var GOOGLE_CLIENT_ID = "112960821724-h76qs8lp9veg1bnhoesv082vdbj3tahq.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "ppl0nLHkIECsIMO_rpJKR7ET";

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
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback: true
    },
    function(request, accessToken, refreshToken, profile, done) {
		User.findOrCreate({_id: profile.id}, function(err, user, created) {
		  console.log('new user');
		  User.findOrCreate({}, function(err, user, created) {
			request.session.user = user;
			return done(err, user);
		  })
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