const express = require('express');
const router = express.Router();
const User = require('../model/user');
const Reservations = require('../model/reservation');

router.get('/payment', (req, res) => {
    res.render('payment');
});

router.post('/payment', async (req, res) => {
    try {
        const reservationData = req.body;
        const reserv = new Reservations(reservationData);
        await reserv.save();
        res.status(200).json(reserv);
        console.log(reservationData);
        console.log("hi");
    } catch (error) {
        console.error("Error saving reservation:", error);
        res.status(500).send('Internal Server Error');
    } 
});

router.put('/payment', async (req, res) => {
    try {
        const reservationData = req.body;

        const existingDate = await Reservations.findOne({
            "date_exact": reservationData.date_exact,
        });

        if (existingDate) { 
            const existingTime = existingDate.times.find(timeSlot => timeSlot.time === reservationData.times[0].time); //res.status(200).send(existingTime)
            if (existingTime) {
                existingTime.reservations.push({ //mongoose push method, there's also $push operator (updateOne)
                    user: reservationData.times[0].reservations[0].user,
                    people: reservationData.times[0].reservations[0].people,
                    additionalForm: reservationData.times[0].reservations[0].additionalForm,
                    orderedFood: reservationData.times[0].reservations[0].orderedFood,
                    additionalplan: reservationData.time[0].reservations[0].additionalplan,
                })
                /* await Reservations.updateOne({
                    "date_exact": reservationData.date_exact,
                    "times.time": reservationData.times[0].time
                }, { 
                    $set: {
                        "times.$": existingTime,
                    }
                });  */
                res.status(200).send(existingTime);
            } else {
                //const addedTime = existingDate.times;
                existingDate.times.push({
                    time: reservationData.times[0].time,
                    reservations: [{
                        user: reservationData.times[0].reservations[0].user,
                        people: reservationData.times[0].reservations[0].people,
                        additionalForm: reservationData.times[0].reservations[0].additionalForm,
                        orderedFood: reservationData.times[0].reservations[0].orderedFood,
                        additionalplan: reservationData.time[0].reservations[0].additionalplan,
                    }]
                });
                res.status(200).send(existingDate);
            }
            await existingDate.save();
        } else {
            res.status(404).send('Data not found');
        }
    } catch (err) {
        console.error("Error: " + err.message); 
        res.status(500).send('Internal server error: ' + err.message);
    }
});

module.exports = router; //export router as a middleware function

/* TODO: 
        protect the routes
        add delete functionnality       
*/