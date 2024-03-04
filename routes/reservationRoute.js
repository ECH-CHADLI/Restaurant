const express = require('express');
const router = express.Router();
const User = require('../model/user');
const Reservations = require('../model/reservation');

// Post first form
router.post('/indexlogout', (req, res) => {
    const {people, time, date} = req.body;
    if(!date || !time || !people) {
        return res.status(400).send('Please fill in all the fields')
    }
    //res.json({people, time, date});
    res.redirect('/reservation/menu?menuCreation=true');
})

//storage of radio input
router.get('/store_radio_value', (req, res) => {
    res.render('store_radio_value');
});

// Menu 
router.get('/menu', (req, res) => {

    const cartCreation = req.query.cartCreation;
    res.render('menu', {cartCreation: cartCreation, user: req.session.user}); // second champ is for data retrieved in the client
});

// Add form after menu
router.get('/additional_form', (req, res) => {

    try {
      res.render('add_form', { user: req.session.user });
    } catch (error) {
      console.error('Error rendering seats-form:', error);
      res.status(500).send('Internal Server Error');
    } 
})

router.get('/food_order', (req, res) => {
    const orderFood = req.query.foodData;
    const sumPrice = req.query.priceSum;
    console.log("orderFood: " + orderFood + ", sumPrice: " + sumPrice)
    if(orderFood) {
      res.render('food_order', {foodData: orderFood, priceSum: sumPrice, user: req.session.user});
    } else {
      res.redirect('/menu'); 
    }
})

router.get('/payment', (req, res) => {
    res.render('payment', { user: req.session.user });
});

router.post('/payment', async (req, res) => {
    
    try {
        const reservationData = req.body;
        console.log(reservationData)
        const existingDate = await Reservations.findOne({
            "date_exact": reservationData.date_exact,
        });

        if (existingDate) { 

            const existingTime = existingDate.times.find(timeSlot => timeSlot.time === reservationData.times[0].time); //res.status(200).send(existingTime)

            if (existingTime) { // existingTime affect the underlying object within the existingDate document -> it affects existingDate -> affects the db
                existingTime.reservations.push({ //mongoose push method, there's also $push operator (updateOne)
                    seat: reservationData.times[0].reservations[0].seat,
                    //user: req.session.user.firstName + ' ' + req.session.user.lastName,/* reservationData.times[0].reservations[0].user, */
                    user: "ddd",
                    people: reservationData.times[0].reservations[0].people,
                    additionalForm: reservationData.times[0].reservations[0].additionalForm,
                    orderedFood: reservationData.times[0].reservations[0].orderedFood
                })

                res.status(200).send(existingTime);
            } else {
                existingDate.times.push({
                    time: reservationData.times[0].time,
                    reservations: [{
                        seat: reservationData.times[0].reservations[0].seat,
                        //user: req.session.user.firstName + ' ' + req.session.user.lastName, /* reservationData.times[0].reservations[0].user, */
                        user: "ddd",
                        people: reservationData.times[0].reservations[0].people,
                        additionalForm: reservationData.times[0].reservations[0].additionalForm,
                        orderedFood: reservationData.times[0].reservations[0].orderedFood
                    }]
                });
                res.status(200).send(existingDate);
            }
            console.log("treat: ", reservationData);
            await existingDate.validate();
            await existingDate.save();
        } else { 
            reservationData.times[0].reservations[0].user = "ddd";
            //reservationData.times[0].reservations[0].user = req.session.user.firstName + ' ' + req.session.user.lastName;
            const reserv = new Reservations(reservationData);
            await reserv.validate();
            await reserv.save();
            res.status(200).json(reserv); 
        }
    } catch (error) {
        console.error(error);
        res.redirect('/indexlogout');
    } 
});

module.exports = router; //export router as a middleware function