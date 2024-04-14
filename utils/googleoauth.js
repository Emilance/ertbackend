const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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

      
   
            // const accessToken = generateToken(
            //   { user_id: user._id, email: user.email , role: user.role},
            //   "7d"
            // );
            //  console.log('theu', user)
            // res.cookie('token', accessToken);
            // res.cookie('user',  JSON.stringify({email : user.email, role : user.role ,
            //                     name:user.lastName || "No name", 
            //                     emailVerified:user.emailVerified }))
        
        // console.log(user)
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));





module.exports = passport;
