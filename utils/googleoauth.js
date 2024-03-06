const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');
require("dotenv").config();



// Configure Passport with Google OAuth
 passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID ,
    clientSecret: process.env.GOOGLE_SECRET ,
    callbackURL: 'https://easyrent-44an.onrender.com/auth/google/callback',
    scope: ['profile', 'email'] 
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists in the database
        let user = await User.findOne({ email: profile.emails[0].value });
        
        if (!user) {
            // Create a new user if not found
            user = new User({
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                emailVerified: true, // Assuming Google OAuth emails are verified
                role: 'student', // Set default role
                profilePicture: profile.photos[0].value // Get profile picture URL
            });
            
            // Save the new user to the database
            await user.save();
        }
        
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));





module.exports = passport;
