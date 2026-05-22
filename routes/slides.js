const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Slide = require('../models/Slide');

// Configuración de Cloudinary (toma las claves de tu .env)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuración de Multer para el Carrusel
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'radio_libertad_slides', // Carpeta separada en tu Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
    }
});

const upload = multer({ storage: storage });

// ==========================================
// ENDPOINTS
// ==========================================

// GET: Traer todos los slides de la portada
router.get('/', async (req, res) => {
    try {
        const slides = await Slide.find().sort({ fecha: -1 });
        res.json(slides);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los slides' });
    }
});

// POST: Crear un nuevo slide con imagen
router.post('/', upload.single('imagen'), async (req, res) => {
    try {
        const datosSlide = {
            titulo: req.body.titulo,
            subtitulo: req.body.subtitulo,
            link: req.body.link
        };

        if (req.file) {
            datosSlide.imagen = req.file.path; // URL de Cloudinary
        } else {
            return res.status(400).json({ mensaje: 'La imagen es obligatoria para el carrusel' });
        }

        const nuevoSlide = new Slide(datosSlide);
        const slideGuardado = await nuevoSlide.save();
        res.status(201).json(slideGuardado);
    } catch (error) {
        console.error("Error al crear slide:", error);
        res.status(400).json({ mensaje: 'Error al guardar el slide' });
    }
});

// PUT: Modificar un slide existente
router.put('/:id', upload.single('imagen'), async (req, res) => {
    try {
        const datosActualizados = {
            titulo: req.body.titulo,
            subtitulo: req.body.subtitulo,
            link: req.body.link
        };

        // Si subió una foto nueva, la actualizamos. Si no, queda la anterior
        if (req.file) {
            datosActualizados.imagen = req.file.path;
        }

        const slideActualizado = await Slide.findByIdAndUpdate(
            req.params.id,
            datosActualizados,
            { new: true }
        );

        res.json(slideActualizado);
    } catch (error) {
        console.error("Error al actualizar slide:", error);
        res.status(400).json({ mensaje: 'Error al actualizar el slide' });
    }
});

// DELETE: Eliminar un slide
router.delete('/:id', async (req, res) => {
    try {
        await Slide.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Slide eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el slide' });
    }
});

module.exports = router;