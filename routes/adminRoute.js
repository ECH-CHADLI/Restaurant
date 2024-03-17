const express = require('express')
const router = express.Router()
const Reservations = require('../model/reservation');

// Show all reservations
router.get('/reservations', async (req, res) => {

    try {

        const reservations = await Reservations.find()
            .sort({'date_exact': 1, 'times.time': 1}) // 1 is for ascending, -1 for descending
            .select('date_exact times.time times.reservations.user times.reservations.orderedFood.priceFood times.reservations.people times.reservations.seat times.reservations._id')
            .exec();

        //res.json(reservations);

        res.render('admin/admin-reservations', {reservations: reservations}); 
    } catch(err) {
        res.status(500).json({message: error.message});
    }
});

// Show a specific reservation
router.get('/reservation/:id/:date/:time', async (req, res) => {

    const date = new Date(req.params.date);
    const time = req.params.time;

    try {

        const reservationObj =  await Reservations.findOne(
            {'times.reservations._id': req.params.id}
        ).exec(); // RETURNS THE DOCUMENT where the id is, but not the specific field the id represents

        // Put all reservations inside one flattened array to find the right position of the id
        const reservation = reservationObj.times.flatMap(time => time.reservations).find(reservation => reservation._id.toString() === req.params.id);

        //res.json(reservation);

        res.render('admin/specific-reservation', {reservation, dateTimeObj: {date, time}})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// Show the input page that performs the update (Copy paste the last function)
router.get('/reservation/update/:id/:date/:time', async (req, res) => {

    const date = new Date(req.params.date);
    const time = req.params.time;

    try {

        const reservationObj =  await Reservations.findOne(
            {'times.reservations._id': req.params.id}
        ).exec();

        const reservation = reservationObj.times.flatMap(time => time.reservations).find(reservation => reservation._id.toString() === req.params.id);

        res.render('admin/update-reservation', {reservation, dateTimeObj: {date, time}})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// Update this specific reservation
router.put('/reservation/:id', async (req, res) => {

    try{

        const updateReservation = req.body;
        
        const existingDate = await Reservations.findOne({
            "date_exact": updateReservation.date_exact
        });

        if (existingDate) { 

            const existingTime = existingDate.times.find(timeSlot => timeSlot.time === updateReservation.times[0].time); 

            if (existingTime) {
                
                let existingId = existingTime.reservations.find(reservation => reservation._id.toString() === req.params.id);

                if(existingId) {
                
                    existingId.seat = updateReservation.times[0].reservations[0].seat,
                    //existingId.user = req.session.user.firstName + ' ' + req.session.user.lastName,
                    existingId.user = "ddd",
                    existingId.people = updateReservation.times[0].reservations[0].people,
                    existingId.additionalForm = updateReservation.times[0].reservations[0].additionalForm,
                    existingId.orderedFood = updateReservation.times[0].reservations[0].orderedFood
    
                    res.status(200).send(existingTime);
                } else {

                    existingTime.reservations.push({
                        seat: updateReservation.times[0].reservations[0].seat,
                        //user: req.session.user.firstName + ' ' + req.session.user.lastName, 
                        user: "ddd",
                        people: updateReservation.times[0].reservations[0].people,
                        additionalForm: updateReservation.times[0].reservations[0].additionalForm,
                        orderedFood: updateReservation.times[0].reservations[0].orderedFood
                    })
                }

            } else {

                await existingDate.updateOne(
                    {"times.reservations._id": req.params.id},
                    {"$pull": {"times.$.reservations": {_id: req.params.id}}}
                );

                existingDate.times.push({
                    time: updateReservation.times[0].time,
                    reservations: [{
                        seat: updateReservation.times[0].reservations[0].seat,
                        //user: req.session.user.firstName + ' ' + req.session.user.lastName, 
                        user: "ddd",
                        people: updateReservation.times[0].reservations[0].people,
                        additionalForm: updateReservation.times[0].reservations[0].additionalForm,
                        orderedFood: updateReservation.times[0].reservations[0].orderedFood
                    }]
                });

                res.status(200).send(existingDate);
            }
            await existingDate.validate();
            await existingDate.save();

        } else { 

            updateReservation.times[0].reservations[0].user = "ddd";
            //updateReservation.times[0].reservations[0].user = req.session.user.firstName + ' ' + req.session.user.lastName;
            const reserv = new Reservations(updateReservation);
            await reserv.validate();
            await reserv.save();
            res.status(200).json(reserv); 
        } 

    } catch (error) {
        res.status(500).json({message: error.message});
    } 
})

module.exports = router;

//TODO: Refactor the code