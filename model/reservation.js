const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const addFormSchema = new Schema({
    allergies: { type: String, required: false},
    occasion: { type: String, required: false},
    requests: { type: String, required: false}
});

const selectedFoodSchema = new Schema({
    titleFood: { type: String, required: true},
    imgFood: { type: String, required: true},
    priceFood: { type: String, required: true},
    quantityFood: { type: String, required: true}
});

const oneReservationSchema = new Schema({
    additionalForm : addFormSchema,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderedFood: [selectedFoodSchema],
    //seat info
    //people 
});

const timeSchema = new Schema({
    reservation : [oneReservationSchema]
});

const dateSchema = new Schema({
    times: [timeSchema]
});

const reservationsSchema = new Schema({
    dates: [dateSchema]
});

const Reservations = mongoose.model('Reservation', reservationsSchema);

module.exports = { Reservations };