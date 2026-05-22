require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- RUTA DE TEST RÁPIDA ---
app.get('/api/test', (req, res) => res.json({ status: "ok" }));

// --- IMPORTACIÓN DE RUTAS ---
// Usamos try/catch para saber si una ruta está rompiendo el inicio del servidor
try {
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/sponsors', require('./routes/sponsors'));
    app.use('/api/slides', require('./routes/slides'));
} catch (err) {
    console.error("❌ Error cargando rutas:", err);
}

// Función de conexión robusta
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    return await mongoose.connect(process.env.MONGO_URI);
};

// Handler para Vercel
module.exports = async (req, res) => {
    try {
        await connectDB();
        return app(req, res);
    } catch (err) {
        console.error("❌ Error en el handler:", err);
        res.status(500).json({ error: "Fallo en la función", details: err.message });
    }
};