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

async function loginUser(req, res) {
    try {
        const { username, password } = req.body;

        // Verificar las credenciales del usuario en la base de datos
        const isValidUser = await db.verifyCredentials(username, password);

        if (isValidUser) {
            // Guardar la información del usuario en la sesión
            req.session.username = username;

            // Redirigir a una página de éxito o realizar alguna otra acción después de registrar al usuario
            res.send('¡Usuario logueado exitosamente!');

            // Redirigir a la página de inicio o a donde sea necesario
            //res.redirect('/');

            // En tu controlador de inicio de sesión
            req.session.username = username;

        } else {
            // Manejar la autenticación fallida, por ejemplo, renderizando un mensaje de error
            res.render('login', { error: 'Credenciales inválidas' });
        }
    } catch (error) {
        //console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error al iniciar sesión');
    }
}

// Exportar la función del controlador
module.exports = {
    registerUser,
    loginUser,
};