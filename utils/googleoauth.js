const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const mongoose = require('mongoose');
const User = require('../models/User');
const { generateToken } = require('./generatejwt');
require("dotenv").config();



// Configure Passport with Google OAuth
 passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID ,
    clientSecret: process.env.GOOGLE_SECRET ,
    callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
    scope: ['profile', 'email'] 
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists in the database
        let user = await User.findOne({ email: profile.emails[0].value });
        // console.log('profile', profile)
        if (!user) {
            // Create a new user if not found
            user = new User({
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                emailVerified: true, 
                role: 'student', 
                profilePicture: profile.photos[0].value,
                password: 'google',
                oauth :true
            });  
            
            // Save the new user to the database
            await user.save();
        }

      
   
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));











passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID ,
        clientSecret: process.env.FACEBOOK_SECRET ,
        callbackURL: `${process.env.SERVER_URL}/auth/facebook/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile._json.email });
  
          if (!user) {
            user = new User({
              firstName: profile._json.first_name,
              lastName: profile._json.last_name,
              email: profile._json.email,
              emailVerified: true, 
                role: 'student', 
                profilePicture: profile.photos[0].value,
                password: 'google',
                oauth :true
            });
  
            await user.save();
          }
  
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );





module.exports = passport;
