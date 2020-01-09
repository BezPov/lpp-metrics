const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
    _createdAt: Date,
    service: {
        name: String,
        version: String,
        url: String,
        method: String
    },
    request: {
        url: String,
        duration: Number
    },
    type: {
        type: String,
        enum: ['request']
    }
});

module.exports = mongoose.model('Metric', metricSchema);