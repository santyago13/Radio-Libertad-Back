require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// IMPORTANTE: Asegúrate de que estos archivos existan en ../routes/
app.use('/api/auth', require('../routes/auth'));
app.use('/api/sponsors', require('../routes/sponsors'));
app.use('/api/slides', require('../routes/slides'));

app.get('/api/test', (req, res) => res.json({ status: "ok" }));

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGO_URI);
};

module.exports = async (req, res) => {
    try {
        await connectDB();
        return app(req, res);
    } catch (err) {
        console.error("❌ Error interno:", err);
        res.status(500).json({ error: "Fallo en el servidor", details: err.message });
    }
};