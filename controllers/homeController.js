const db = require('../models/db.js'); // Ruta relativa al archivo db.js

// Controlador para manejar la solicitud de registro de un nuevo usuario
async function registerUser(req, res) {
    try {
        // Obtener los datos del formulario de registro
        const { username, password } = req.body;

        // Insertar el usuario en la base de datos
        await db.insertUser(username, password);

        // Redirigir a una página de éxito o realizar alguna otra acción después de registrar al usuario
        res.send('¡Usuario registrado exitosamente!');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        // Manejar el error de alguna manera, como renderizar una página de error o redirigir a otra página
        res.status(500).send('Error al registrar usuario');
    }
}

// Exportar la función del controlador
module.exports = {
    registerUser
};