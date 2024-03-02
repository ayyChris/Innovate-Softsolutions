const db = require('../models/db.js'); // Ruta relativa al archivo db.js

// Controlador para manejar la solicitud de registro de un nuevo usuario
async function registerUser(req, res) {
    try {
        // Obtener los datos del formulario de registro
        const { username, password } = req.body;

        // Insertar el usuario en la base de datos
        await db.registerUserDB(username, password);

        // Redirigir a una página de éxito o realizar alguna otra acción después de registrar al usuario
        res.send('<script>alert("¡Registro exitoso!"); window.location.href = "/login";</script>');
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
        const isValidUser = await db.loginUserDB(username, password);

        if (isValidUser) {
            res.cookie('username', username);
            // Enviar una SweetAlert de éxito
            res.send('<script>alert("¡Inicio de sesión exitoso!"); window.location.href = "/buyServices";</script>');
        } else {
            // Enviar una SweetAlert de error
            res.send('<script>alert("¡Credenciales inválidas!"); window.location.href = "/login";</script>');
        }
    } catch (error) {
        // Enviar una SweetAlert de error en caso de excepción
        res.send('<script>alert("¡Ocurrió un error!"); window.location.href = "/login";</script>');
    }
}


async function getUserInfo(req, res) {
    try {
        const username = req.cookies.username;
        const userInfo = await db.getUserInfoDB(username);
        console.log("HOLA DESDE USERINFO", userInfo);
        if (userInfo) {
            res.status(200).json({
                idUser: userInfo.idUser,
                username: userInfo.username
            });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        res.status(500).json({ error: 'Se produjo un error al procesar la solicitud' });
    }
}

async function buyServices(req, res) {
    try {
        const service = req.body.service;

        const username = req.cookies.username;

        // Comprar el servicio
        await db.buyServicesDB(service, username);

        res.send('<script>alert("¡Se ha añadido el servicio al carrito exitosamente!"); window.location.href = "/buyServices";</script>');

    } catch (error) {
        console.error('Error al comprar servicio:', error);
        res.status(500).json({ error: 'Se produjo un error al procesar la solicitud' });
    }
}

async function myServices(req, res) {
}

async function showCard(req, res) {
    try {
        const username = req.cookies.username;
        const cardInfoArray = await db.showCardDB(username);
        if (cardInfoArray && cardInfoArray.length > 0) {
            res.status(200).json(cardInfoArray);
            console.log(cardInfoArray);
        } else {
            res.status(404).json({ error: 'Informacion de carrito no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener la información del carrito:', error);
        res.status(500).json({ error: 'Se produjo un error al procesar la solicitud' });
    }
}



// Exportar la función del controlador
module.exports = {
    registerUser,
    loginUser,
    getUserInfo,
    buyServices,
    myServices,
    showCard,
};