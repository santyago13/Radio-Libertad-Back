const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Sponsor = require('../models/Sponsor');

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuración de Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'radio_libertad_sponsors',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
    }
});

const upload = multer({ storage: storage });

// GET: Traer todos los sponsors
router.get('/', async (req, res) => {
    try {
        const sponsors = await Sponsor.find().sort({ fecha: -1 });
        res.json(sponsors);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los sponsors' });
    }
});

// POST: Crear nuevo sponsor
router.post('/', upload.single('imagen'), async (req, res) => {
    try {
        const datosSponsor = {
            nombre: req.body.nombre,
            link: req.body.link,
            estado: req.body.estado
        };

        if (req.file) {
            datosSponsor.imagen = req.file.path; 
        }

        const nuevoSponsor = new Sponsor(datosSponsor);
        const sponsorGuardado = await nuevoSponsor.save();
        res.status(201).json(sponsorGuardado);
    } catch (error) {
        console.error("Error backend:", error);
        res.status(400).json({ mensaje: 'Error al guardar el sponsor' });
    }
});

router.put('/:id', upload.single('imagen'), async (req, res) => {
    try {
        const datosActualizados = {
            nombre: req.body.nombre,
            link: req.body.link,
            estado: req.body.estado
        };

        if (req.file) {
            datosActualizados.imagen = req.file.path;
        }

        const sponsorActualizado = await Sponsor.findByIdAndUpdate(
            req.params.id, 
            datosActualizados, 
            { new: true } 
        );

        res.json(sponsorActualizado);
    } catch (error) {
        console.error("Error al actualizar:", error);
        res.status(400).json({ mensaje: 'Error al actualizar el sponsor' });
    }
});

// DELETE: Borrar un sponsor
router.delete('/:id', async (req, res) => {
    try {
        await Sponsor.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Sponsor eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar' });
    }
});

module.exports = router;