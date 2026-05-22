const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    subtitulo: { type: String },
    imagen: { type: String, required: true }, // URL de Cloudinary
    link: { type: String }, // Opcional, por si quieren que redirija a una noticia
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Slide', slideSchema);