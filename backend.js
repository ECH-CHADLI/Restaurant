// app.js 
const express = require('express');
const app = new express(); // main application instance
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('./routes/index');
const User = require('./model/user');
const signupRouter = require('./routes/auth');
const reservationRouter = require('./routes/reservationRoute');

app.set('view engine', 'ejs'); //ejs is a view engine
app.use(express.urlencoded({ extended: true })); //middleware for POST requests
app.use(express.json()); //middleware for json data such as API s

// Setup session middleware
app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true,
}));
app.use(signupRouter);

// Routes
app.use('/auth', authRoutes);

//reservation router
app.use(reservationRouter);

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

//menu without loging in
app.get('/menu', (req, res) => {
  const cartCreation = req.query.cartCreation;
  res.render('menu', {cartCreation: cartCreation});
});

//add form after menu
app.get('/additional_form', (req, res) => {
  try {
    res.render('add_form');
  } catch (error) {
    console.error('Error rendering seats-form:', error);
    res.status(500).send('Internal Server Error');
  }
})

app.get('/food_order', (req, res) => {
  const orderFood = req.query.foodData; //the data after ? -> is the query parameters
  const sumPrice = req.query.priceSum;
  res.render('food_order', {foodData: orderFood, priceSum: sumPrice});
})

//payment page rendering
app.get('/payment', (req, res) => {
  res.render('payment');
})

// Dashboard route
app.get('/indexlogout', (req, res) => {
  if (req.session.user) {
    res.render('indexlogout', { user: req.session.user });
  } else {
    res.redirect('/auth/login'); // _blank in input!?
  }
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
app.listen(3100, '127.0.0.1',()=>{
    console.log("server is running")
});

//get method returns the value of the set method(2nd parameter)

/* use method => register middleware(2nd parameter) functions (has req and resp objects, and next),
for parsing data, auth, error handling...*/

/* Sessions allow you to store user specific data on the server, 
and the client is identified through a session ID stored in a cookie */