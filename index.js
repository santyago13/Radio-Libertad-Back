require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Tus rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sponsors', require('./routes/sponsors'));
app.use('/api/slides', require('./routes/slides'));

app.get('/api/test', (req, res) => res.json({ status: "ok" }));

// CONEXIÓN A DB
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGO_URI);
};

// --- EL MODO HÍBRIDO ---
if (process.env.VERCEL) {
    // Si estamos en Vercel, exportamos el handler
    module.exports = async (req, res) => {
        await connectDB();
        return app(req, res);
    };
} else {
    // Si estamos en local, arrancamos el servidor manualmente
    const PORT = process.env.PORT || 5000;
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor local corriendo en http://localhost:${PORT}`);
        });
    });
}