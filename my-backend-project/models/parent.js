// models/Parent.js
const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true,
    },
    dob: {
        type: Date, // We'll store the DOB as a Date object
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Parent', parentSchema);