// server.js

// 1. Import necessary libraries
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Admin = require('./models/admin');
const Parent = require('./models/parent');
const Student = require('./models/Student'); // Core data model
const Attendance = require('./models/Attendance'); // Core data model


// 2. Initialize the Express app
const app = express();
// Setting PORT to 5000 is common for backends, changed from 3000 to avoid conflict with React default
const PORT = process.env.PORT || 5000;

// 3. Add middleware
app.use(cors());
app.use(express.json());

// 4. Database connection
const DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/anganwadi';
mongoose.connect(DB_URI)
    .then(() => console.log('Connected to MongoDB! 🌟'))
    .catch((error) => console.error('Connection error:', error));

// 5. Define API routes

app.get('/', (req, res) => {
    res.send('Welcome to your backend!');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() });
});

// --- AUTHENTICATION ROUTES (Existing Logic) ---

// Admin Registration Route
app.post('/api/admin/register', async (req, res) => {
    try {
        const { username, employeeId, password } = req.body;
        // Check if admin already exists (Good practice)
        if (await Admin.findOne({ employeeId })) {
            return res.status(409).json({ message: 'Admin with this Employee ID already exists.' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newAdmin = new Admin({ username, employeeId, password: hashedPassword });
        await newAdmin.save();
        res.status(201).json({ message: 'Admin registered successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed.', error: error.message });
    }
});

// Parent Registration Route
app.post('/api/parent/register', async (req, res) => {
    try {
        const { studentName, dob, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newParent = new Parent({ studentName, dob, password: hashedPassword });
        await newParent.save();
        res.status(201).json({ message: 'Parent registered successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed.', error: error.message });
    }
});

// Admin Login Route
app.post('/api/admin/login', async (req, res) => {
    try {
        const { employeeId, password } = req.body;
        const admin = await Admin.findOne({ employeeId }); // Use employeeId for lookup
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        // NOTE: In a real app, you would generate and send a JWT token here.
        res.status(200).json({ message: 'Admin login successful.', user: { username: admin.username, employeeId: admin.employeeId } });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

// Parent Login Route
app.post('/api/parent/login', async (req, res) => {
    try {
        const { studentName, password } = req.body; // Removed 'dob' from destructuring, rely on studentName for lookup
        const parent = await Parent.findOne({ studentName });
        if (!parent) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        const isMatch = await bcrypt.compare(password, parent.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        res.status(200).json({ message: 'Parent login successful.', user: { studentName: parent.studentName } });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

// NEW ROUTES: Get all admins and all parents
app.get('/api/admins', async (req, res) => {
    try {
        const admins = await Admin.find().select('-password');
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

app.get('/api/parents', async (req, res) => {
    try {
        const parents = await Parent.find().select('-password');
        res.status(200).json(parents);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});


// --- CORE APPLICATION ROUTES: STUDENT MANAGEMENT ---

// POST /api/students: Add a new student
app.post('/api/students', async (req, res) => {
    try {
        const { name, age, gender } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Student name is required.' });
        }

        const newStudent = new Student({
            name,
            age,
            gender,
            joinDate: new Date().toISOString().split('T')[0]
        });
        const student = await newStudent.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Error adding student.', error: error.message });
    }
});

// GET /api/students: Retrieve all students
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find({}).sort({ name: 1 });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students.', error: error.message });
    }
});

// DELETE /api/students/:id: Remove a student and their attendance records
app.delete('/api/students/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        const studentResult = await Student.findByIdAndDelete(studentId);
        if (!studentResult) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        // Crucial: Delete all associated attendance records for data integrity
        await Attendance.deleteMany({ studentId: studentId });

        res.status(200).json({ message: 'Student and associated records removed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing student.', error: error.message });
    }
});


// --- CORE APPLICATION ROUTES: ATTENDANCE MANAGEMENT ---

// PUT /api/attendance/:date/:studentId: Mark or update attendance
app.put('/api/attendance/:date/:studentId', async (req, res) => {
    const { date, studentId } = req.params;
    const { status } = req.body;

    if (!status || !['present', 'absent'].includes(status)) {
        return res.status(400).json({ message: 'Invalid attendance status provided.' });
    }

    try {
        // Use findOneAndUpdate with upsert: true to create/update the record in one go
        const record = await Attendance.findOneAndUpdate(
            { date: date, studentId: studentId },
            { $set: { status: status } },
            { new: true, upsert: true }
        );

        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: 'Error updating attendance.', error: error.message });
    }
});

// GET /api/attendance/:date: Get attendance records for a specific date
app.get('/api/attendance/:date', async (req, res) => {
    const date = req.params.date;
    try {
        const records = await Attendance.find({ date: date });

        // Convert array of records to the key-value object { studentId: status } expected by frontend
        const attendanceObject = records.reduce((acc, record) => {
            acc[record.studentId.toString()] = record.status;
            return acc;
        }, {});

        res.status(200).json(attendanceObject);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching daily attendance.', error: error.message });
    }
});

// DELETE /api/attendance/:date: Clear all attendance for a date
app.delete('/api/attendance/:date', async (req, res) => {
    const date = req.params.date;
    try {
        const result = await Attendance.deleteMany({ date: date });
        res.status(200).json({
            message: `Cleared ${result.deletedCount} attendance records for ${date}.`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing attendance records.', error: error.message });
    }
});


// 6. Start the server
// 404 handler (for unmatched routes)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});