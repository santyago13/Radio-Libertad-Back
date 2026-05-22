const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
    const { usuario, password } = req.body;

    // Comparamos con las variables de entorno
    if (usuario === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
        // Si está todo bien, creamos un token que dura 24 horas
        const token = jwt.sign({ id: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } else {
        res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
    }
});

module.exports = router;