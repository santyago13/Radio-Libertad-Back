const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importar y usar Rutas
app.use('/api/auth', require('../routes/auth'));
app.use('/api/sponsors', require('../routes/sponsors'));
app.use('/api/slides', require('../routes/slides'));

// Ruta de prueba base
app.get('/', (req, res) => {
    res.send('✅ El servidor de la radio está funcionando');
});

// Función para conectar a MongoDB
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGO_URI);
};

// Exportamos la app como un "handler" para Vercel
module.exports = async (req, res) => {
    await connectDB();
    app(req, res);
};