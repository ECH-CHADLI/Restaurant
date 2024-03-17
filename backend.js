// app.js 
const express = require('express');
const app = new express(); // main application instance
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('./routes/index');
const User = require('./model/user');
const signupRouter = require('./routes/auth');
const reservationRouter = require('./routes/reservationRoute');
const adminRouter = require('./routes/adminRoute');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs'); //ejs is a view engine
app.use(express.urlencoded({ extended: true })); //middleware for POST requests
app.use(express.json()); //middleware for json data such as API s
app.use(bodyParser.json()); //middleware that handles http body requests

// Setup session middleware
app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true,
}));

app.use(signupRouter);

// Routes
app.use('/auth', authRoutes);

// Reservation router
app.use('/reservation', reservationRouter);

// Admin router
app.use('/admin', adminRouter);

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Dashboard route
app.get('/indexlogout', (req, res) => {
  if (req.session.user) {
    res.render('indexlogout', { user: req.session.user });
  } else {
    res.redirect('/auth/login'); 
  }
  res.render('indexlogout');
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/auth/login');
  });
});





// Connect to MongoDB
mongoose.connect('mongodb+srv://hamzaechadli:wbuS3KHpOCcojgDV@cluster0.zan2cqz.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

//server 
app.get('/', (req, res) => {
    res.render('index.ejs')
})
app.use(express.static('public')); //adding the static files middleware in public dir, in order to access files directly like so /code.js
const PORT = 3000;
app.listen(PORT, '127.0.0.1',()=>{
    console.log("server is running")
});
module.exports = { PORT }; 