const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config(); // Cargar las variables de entorno desde el archivo .env

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para cargar el script de Google Maps con la clave de la API
app.get('/maps-api', async (req, res) => {
    const { callback } = req.query; // Callback para inicializar el mapa
    try {
        // Construir la URL para Google Maps API
        const url = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&callback=${callback}`;
        res.redirect(url);  // Redirigir al cliente al script de Google Maps
    } catch (error) {
        console.error('Error al cargar la API de Google Maps:', error);
        res.status(500).send('Error al cargar la API de Google Maps');
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
