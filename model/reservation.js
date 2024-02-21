const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RadioValueSchema = new Schema({
    value: {type: String,required: true},
  });

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
    RadioValueSchema : RadioValueSchema,
    additionalForm : addFormSchema,
    user: { type: String, ref: 'User' }, //mongoose.Schema.Types.ObjectId
    orderedFood: [selectedFoodSchema],
    people: { type: String }, 
    //seat info!!!!
});

const timeSchema = new Schema({
    time: { type: String, required: true },
    reservations : [oneReservationSchema]
});

const reservationsSchema = new Schema({
    date_exact: { type: Date, required: false },
    times: [timeSchema]
});

const Reservations = mongoose.model('Reservations', reservationsSchema);

module.exports = Reservations;
