const mongoose = require('mongoose');

const arrivalSchema = new mongoose.Schema({
    timeOfCheck: Date,
    validity: Number,
    estimatedTimeOfArrival: Number,
    busNumber: String
});

module.exports = mongoose.model('Arrival', arrivalSchema);