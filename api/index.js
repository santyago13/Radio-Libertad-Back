const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importar Rutas (Fijate que los puntos "../" hacen que suba un nivel a la raíz)
app.use('/api/auth', require('../routes/auth'));
app.use('/api/sponsors', require('../routes/sponsors'));
app.use('/api/slides', require('../routes/slides'));

app.get('/', (req, res) => {
    res.send('✅ El servidor está funcionando');
});

// Función de conexión a DB
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGO_URI);
};

// --- LÓGICA DE UNIFICACIÓN ---
// Si estamos en Vercel, solo exportamos la app.
// Si estamos en local (no existe la variable VERCEL), levantamos el servidor.

if (process.env.VERCEL) {
    // Modo Vercel: Conectamos antes de que llegue la petición
    module.exports = async (req, res) => {
        await connectDB();
        app(req, res);
    };
} else {
    // Modo Local: Levantamos el servidor como siempre
    const PORT = process.env.PORT || 5000;
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor local corriendo en http://localhost:${PORT}`);
        });
    });
}