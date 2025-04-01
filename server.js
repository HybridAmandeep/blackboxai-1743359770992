const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dbService = require('./db-connection');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Endpoints

// Authentication
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await dbService.getUserCredentials(username);
        
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        res.json({ success: true, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Train Operations
app.get('/api/trains', async (req, res) => {
    try {
        const { from, to } = req.query;
        let trains;
        
        if (from && to) {
            trains = await dbService.getTrainsBetweenStations(from, to);
        } else {
            trains = await dbService.read('Train');
        }
        
        res.json(trains);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/trains', async (req, res) => {
    try {
        const newTrain = await dbService.create('Train', req.body);
        res.status(201).json(newTrain);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/trains/:id', async (req, res) => {
    try {
        const updatedTrain = await dbService.update('Train', req.params.id, req.body);
        res.json(updatedTrain);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Station Operations
app.get('/api/stations', async (req, res) => {
    try {
        const stations = await dbService.read('Station');
        res.json(stations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/stations', async (req, res) => {
    try {
        const newStation = await dbService.create('Station', req.body);
        res.status(201).json(newStation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Booking Operations
app.post('/api/bookings', async (req, res) => {
    try {
        const { reservation, passengers, payment } = req.body;
        const booking = await dbService.createReservation(reservation, passengers, payment);
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/bookings/:pnr', async (req, res) => {
    try {
        const pnr = req.params.pnr;
        const reservation = await dbService.read('Ticket_reservation').find(r => r.PNR_no == pnr);
        
        if (!reservation) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        const passengers = await dbService.read('PAX_info').filter(p => p.PNR_no == pnr);
        const payment = await dbService.read('Pay_info').find(p => p.PNR_no == pnr);
        
        res.json({ reservation, passengers, payment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
});