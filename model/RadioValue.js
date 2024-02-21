const mongoose = require('mongoose');

const RadioValueSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
});
const RadioValue = mongoose.model('RadioValue', RadioValueSchema);

module.exports = RadioValue;
