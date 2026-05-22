const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    estado: { type: String, default: 'Activo' },
    imagen: { type: String },
    link: { type: String },
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sponsor', sponsorSchema);