const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares (Para que React se pueda comunicar sin bloqueos)
app.use(cors());
app.use(express.json());

// Importar nuestras Rutas
const sponsorsRoutes = require('./routes/sponsors');

// Usar las Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sponsors', sponsorsRoutes);
app.use('/api/slides', require('./routes/slides'));

// Ruta de prueba base
app.get('/', (req, res) => {
    res.send('✅ El servidor de la radio está funcionando');
});

// Conexión a Mongo y encendido del servidor
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('🟢 Base de datos conectada con éxito');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('🔴 Error al conectar con MongoDB:', error);
    });