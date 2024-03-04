/* // Import your model
const RadioValue = require('./models/RadioValue');
const express = require('express');
const router = express.Router();
const User = require('../model/user');
routes.get('/store-radio-value',(req,res)=>{
  res.render('store-radio-value')
});
// Your route handler
router.post('/store-radio-value', async (req, res) => {
  const { value } = req.body; // Extract values from the request body

  try {
    // Create a new RadioValue document
    const radioValue = new RadioValue({ value });

    // Save the document to the database
    await radioValue.save();

    res.send('Radio value saved successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving radio value.');
  }
});

module.exports = routes;
 */