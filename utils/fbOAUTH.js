const express = require('express');
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Configure Express session middleware
app.use(session({
  secret: 'your_session_secret',
  resave: false,
  saveUninitialized: true
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport with Facebook OAuth
passport.use(new FacebookStrategy({
  clientID: 'YOUR_APP_ID',
  clientSecret: 'YOUR_APP_SECRET',
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id', 'emails', 'name'] // Specify fields to retrieve from Facebook profile
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
        emailVerified: true, // Facebook OAuth emails are considered verified
        role: 'student', // Set default role
        profilePicture: `https://graph.facebook.com/${profile.id}/picture?type=large` // Get profile picture URL
      });

      // Save the new user to the database
      await user.save();
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Routes for Facebook OAuth
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), (req, res) => {
  // Redirect to dashboard or homepage after successful authentication
  res.redirect('/dashboard');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
