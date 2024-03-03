const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Configure Passport with Google OAuth
passport.use(new GoogleStrategy({
    clientID: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
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

// Initialize Passport
app.use(passport.initialize());

// Routes for Google OAuth
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    // Redirect to dashboard or homepage after successful authentication
    res.redirect('/dashboard');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
