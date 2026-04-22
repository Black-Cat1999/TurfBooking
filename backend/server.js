const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Booking = require('./models/Booking');
const Message = require('./models/Message');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("MONGO_URI is not defined in .env file.");
} else {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('Connected to MongoDB Atlas'))
        .catch(err => console.error('MongoDB connection error:', err));
}

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'API is running' });
});

// 1. Submit Booking
app.post('/api/bookings', async (req, res) => {
    try {
        const { name, date, turfType, price, currency } = req.body;
        
        if (!name || !date || !turfType || !price || !currency) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newBooking = new Booking({
            name,
            date,
            turfType,
            price,
            currency
        });

        await newBooking.save();
        res.status(201).json({ message: 'Booking confirmed successfully', booking: newBooking });
    } catch (error) {
        console.error('Booking Error:', error);
        res.status(500).json({ error: 'Server error while processing booking' });
    }
});

// 2. Submit Contact Message
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newMessage = new Message({
            name,
            email,
            message
        });

        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact Error:', error);
        res.status(500).json({ error: 'Server error while sending message' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
