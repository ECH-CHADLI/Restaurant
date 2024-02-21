// app.js 
const express = require('express');
const app = new express();
const RadioValue = require('./model/RadioValue'); // Import your Mongoose model
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('./routes/index');
const User = require('./model/user');
const signupRouter = require('./routes/auth');
const Reservations = require('./model/reservation');
const paymentRoutes = require('./routes/reservationRoute');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Setup session middleware
app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true,
}));
app.use(signupRouter);

// Routes
app.use('/auth', authRoutes);
// Home route
app.get('/', (req, res) => {
  res.render('index');
});
//storage of radio input
app.get('/store_radio_value', (req, res) => {
  res.render('store_radio_value');
});
app.use(paymentRoutes);

// Define your MongoDB model schema


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
mongoose.connect('mongodb+srv://medbdll:Mohamed1@cluster0.dbl93fc.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));
//server 

app.get('/', (req, res) => {
    res.render('index.ejs')
})
app.use(express.static('public'));
app.listen(9000, '127.0.0.1',()=>{
    console.log("server is running")
});

