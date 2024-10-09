require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 5000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Admin@123',
    database: 'appointment_booking',
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('MySQL connected successfully!');
});

// Middleware to parse JSON bodies
app.use(express.json());  
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Endpoint for user registration
app.post('/register', async (req, res) => {
    console.log(req.body); 
    try {
        const { username, email } = req.body;

        // Validate the received data
        if (!username || !email) {
            return res.status(400).json({ error: 'Username and email are required!' });
        }

        // Insert the new user into the database
        const query = 'INSERT INTO users (username, email) VALUES (?, ?)';
        const [result] = await db.promise().execute(query, [username, email]);

        // Return the new user's ID
        res.status(201).json({ message: 'User registered successfully!', user_id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Endpoint for booking appointments
app.post('/appointments', async (req, res) => {
    try {
        const { user_id, date, description } = req.body;

        // Validate the received data
        if (!user_id || !date || !description) {
            return res.status(400).json({ error: 'All fields are required!' });
        }

        // Prepare SQL query to insert the data into the 'appointments' table
        const query = 'INSERT INTO appointments (user_id, service, date, status, description) VALUES (?, ?, ?, ?, ?)';

        // Execute the SQL query using MySQL connection
        const [result] = await db.promise().execute(query, [user_id, null, date, null, description]);

        // Send a success response with the appointment ID
        res.status(201).json({ message: 'Appointment booked successfully', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error booking appointment' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
