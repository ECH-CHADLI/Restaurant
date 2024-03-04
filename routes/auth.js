const express = require('express');
const router = express.Router(); // specific instance
const User = require('../model/user'); 

// Display the signup page
router.get('/signup', (req, res) => { 
  res.render('signup', { errorMessage: '', errors: {} });
}); 

// Handle the form submission for signup
router.post('/signup', (req, res) => {
  const { firstName, lastName, email, phone, password, passwordconfirme } = req.body;

  // Check if any required fields are empty
  const errors = {};
  if (!firstName) {
    errors.firstName = 'First name is required.';
  }
  if (!lastName) {
    errors.lastName = 'Last name is required.';
  }
  if (!email) {
    errors.email = 'Email is required.';
  }
  if (!phone) {
    errors.phone = 'Phone is required.';
  }
  if (!password) {
    errors.password = 'Password is required.';
  }
  if (!passwordconfirme) {
    errors.passwordconfirme = 'Confirm Password is required.';
  }

  // Check if passwords match
  if (password !== passwordconfirme) {
    errors.passwordconfirme = 'Passwords do not match.';
  }

  // If there are any errors, render the signup page with the error messages
  if (Object.keys(errors).length > 0) {
    return res.render('signup', {
      errorMessage: 'Validation error: Please fill in all required fields.',
      errors,
      firstName,
      lastName,
      email,
      phone,
    });
  }

  User.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        return res.render('signup', {
          errors: { email: 'The email address is already registered.' },
          firstName,
          lastName,
          email,
          phone,
        });
      }

      const newUser = new User({
        firstName,
        lastName,
        email,
        phone,
        password,
      });

      return newUser.save();
    })
    .then(() => {
      // User registered successfully, redirect to login page
      res.redirect('/login');
    })
    .catch(err => {
      // Error handling (if it's a validation error or general error)
      if (err.name === 'ValidationError') {
        // If it's a validation error, extract the field-specific error messages
        const fieldErrors = {};
        for (const field in err.errors) {
          fieldErrors[field] = err.errors[field].message;
        }

        // Render the signup page with the field-specific error messages
        return res.render('signup', {
          errorMessage: 'Please fix the following errors:',
          errors: fieldErrors,
          firstName,
          lastName,
          email,
          phone,
        });
      }

      // If it's not a validation error, handle it as a general error
      console.error('Error saving user:', err);
      res.render('signup', {
        errorMessage: 'An error occurred. Please try again later.',
        firstName,
        lastName,
        email,
        phone,
      });
    });
  });

// Rest of the code...

// Display the login page
router.get('/login', (req, res) => { 
  res.render('login', { errorMessag: '' });
});

// Handle the login form submission
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email, password })
    .then(user => {
      if (user) {
        req.session.user = user;
        res.redirect('/indexlogout');
      } else {
        res.render('login', { errorMessag: 'Invalid email or password.' });
      }
    })
    .catch(err => {
      console.error('Error finding user:', err);
      res.render('login', { errorMessag: 'An error occurred. Please try again later.' });
    });
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;