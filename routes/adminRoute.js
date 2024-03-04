const express = require('express')
const router = express.Router()
const Reservations = require('../model/reservation');

router.get('/get-reservations', async (req, res) => {

    try {
        const reservations = await Reservations.find().sort({'date_exact': 1, 'times.time': 1}); // 1 is for ascending, -1 for descending
        res.json(reservations);
    } catch(err) {
        res.status(500).json({message: error.message});
    }
});

router.get('/get-user', async (req, res) => {

    const date = req.params.date;
    const time = req.params.time;
    const userName = req.params.userName;

    // Validate date format
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
    if (!isValidDate) {
        return res.status(400).json({ message: 'Invalid date format. Date must be in YYYY-MM-DD format.' });
    }

    try {
        const reservation = await Reservations.find({
            'date_exact': new Date(date),
            'times.time': time,
            'times.reservations.user': userName
        }, { // the second parameter is called the "projection" object. It allows you to specify which fields you want to include or exclude from the query result.
            'times.$': 1 // To return only the matched time slot
        });

        console.log(reservation)

        if (reservation.length === 0) {
            return res.status(404).json({ message: 'No reservations found for the specified user.' });
        }

        const userReservation = reservation.times[0].reservations.find(reserv => reserv.user === userName);
        res.json(userReservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;