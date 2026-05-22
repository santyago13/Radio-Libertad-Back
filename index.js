require('dotenv').config();

console.log("DEBUG: Iniciando servidor...");
console.log("DEBUG: MONGO_URI existe?", !!process.env.MONGO_URI);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importar Rutas (Fijate que los puntos "../" hacen que suba un nivel a la raíz)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sponsors', require('./routes/sponsors'));
app.use('/api/slides', require('./routes/slides'));

app.get('/', (req, res) => {
    res.send('✅ El servidor está funcionando');
});

// Función de conexión a DB
const connectDB = async () => {
    // Si ya estamos conectados, no hacemos nada
    if (mongoose.connection.readyState >= 1) return;

    // VERIFICACIÓN CRÍTICA:
    if (!process.env.MONGO_URI) {
        console.error("❌ ERROR CRÍTICO: MONGO_URI no está definido en las variables de entorno.");
        throw new Error("MONGO_URI es necesario");
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Conectado a MongoDB");
    } catch (error) {
        console.error("❌ Error de conexión:", error);
        throw error;
    }
};