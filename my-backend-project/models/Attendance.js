const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId, // Links to the Student document
        ref: 'Student',
        required: true
    },
    date: {
        type: String, // YYYY-MM-DD format for easy querying
        required: true
    },
    status: {
        type: String,
        enum: ['present', 'absent'], // Enforce valid attendance values
        required: true
    }
}, { timestamps: true });

// Enforce uniqueness: A student can only have one attendance record per day
AttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);