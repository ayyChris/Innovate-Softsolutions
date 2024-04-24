const db = require('../models/db.js');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const axios = require('axios');

const xml2js = require('xml2js');

// Obtener la fecha actual en el formato dd/mm/yyyy
const today = new Date();
const day = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0');
const year = today.getFullYear();
const fechaActual = `${day}/${month}/${year}`;

const nombre = 'Christian';
const subNiveles = 'N';
const correoElectronico = 'chrisbf11@gmail.com';
const token = 'C3OC228T6A';

async function buscarPersona(req, res) {
    try {
        const { full_name } = req.body; // Asegúrate de que este sea el nombre del campo en tu formulario HTML

        // Llama a la función buscarPersonaDB para obtener la información de la persona
        const personaEncontrada = await db.buscarPersonaDB(full_name);

        // Verifica si se encontró la persona
        if (personaEncontrada) {
            console.log('Persona encontrada:', personaEncontrada);
            // Devuelve la respuesta al cliente
            res.status(200).json(personaEncontrada);
        } else {
            console.log(`No se encontró ninguna persona con el nombre ${full_name}`);
            res.status(404).json({ error: `No se encontró ninguna persona con el nombre ${full_name}` });
        }
    } catch (error) {
        console.error('Error al buscar persona:', error);
        res.status(500).json({ error: 'Error al buscar persona' });
    }
}


async function obtenerValorCompra(req, res) {
    try {
        const indicador = 317;

        const response = await axios.get('https://gee.bccr.fi.cr/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx/ObtenerIndicadoresEconomicosXML', {
            params: {
                indicador: indicador,
                fechaInicio: fechaActual,
                fechaFinal: fechaActual,
                nombre: nombre,
                subNiveles: subNiveles,
                correoElectronico: correoElectronico,
                token: token
            }
        });

        const xmlData = await xml2js.parseStringPromise(response.data);

        let valorCompraDolar;
        if (xmlData && xmlData.string && xmlData.string._) {
            const datos = xmlData.string._;
            const parser = new xml2js.Parser({ explicitArray: false });
            parser.parseString(datos, (err, result) => {
                if (err) {
                    console.error('Error al parsear la respuesta XML:', err);
                    return res.status(500).json({ error: 'Error al parsear la respuesta XML' });
                }
                valorCompraDolar = parseFloat(result.Datos_de_INGC011_CAT_INDICADORECONOMIC.INGC011_CAT_INDICADORECONOMIC.NUM_VALOR);
                res.status(200).json({ valorCompra: valorCompraDolar }); // Aquí corregido
            });
        } else {
            console.error('Estructura de respuesta XML inesperada:', xmlData);
            res.status(500).json({ error: 'Estructura de respuesta XML inesperada' });
        }
    } catch (error) {
        console.error('Error al obtener el valor de compra del dólar:', error);
        res.status(500).json({ error: 'Error al obtener el valor de compra del dólar' });
    }
}

async function obtenerValorVenta(req, res) {
    try {
        const indicador = 318;

        const response = await axios.get('https://gee.bccr.fi.cr/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx/ObtenerIndicadoresEconomicosXML', {
            params: {
                indicador: indicador,
                fechaInicio: fechaActual,
                fechaFinal: fechaActual,
                nombre: nombre,
                subNiveles: subNiveles,
                correoElectronico: correoElectronico,
                token: token
            }
        });

        const xmlData = await xml2js.parseStringPromise(response.data);

        let valorVentaDolar;
        if (xmlData && xmlData.string && xmlData.string._) {
            const datos = xmlData.string._;
            const parser = new xml2js.Parser({ explicitArray: false });
            parser.parseString(datos, (err, result) => {
                if (err) {
                    console.error('Error al parsear la respuesta XML:', err);
                    return res.status(500).json({ error: 'Error al parsear la respuesta XML' });
                }
                valorVentaDolar = parseFloat(result.Datos_de_INGC011_CAT_INDICADORECONOMIC.INGC011_CAT_INDICADORECONOMIC.NUM_VALOR);
                res.status(200).json({ valorVentaDolar: valorVentaDolar });
            });
        } else {
            console.error('Estructura de respuesta XML inesperada:', xmlData);
            res.status(500).json({ error: 'Estructura de respuesta XML inesperada' });
        }
    } catch (error) {
        console.error('Error al obtener el valor de venta del dólar:', error);
        res.status(500).json({ error: 'Error al obtener el valor de venta del dólar' });
    }
}


async function registerUser(req, res) {
    try {
        console.log(req.body);
        // Obtener los datos del formulario de registro
        const { username, password, full_name, email, phone, security_question, security_answer } = req.body;

        // Verificar si el nombre de usuario ya está en uso
        const isUsernameTaken = await db.isUsernameTaken(username);

        if (isUsernameTaken) {
            // Enviar una SweetAlert de error si el nombre de usuario ya está en uso
            res.send('<script>alert("¡Nombre de usuario ya en uso!"); window.location.href = "/register";</script>');
            return;
        }

        // Registrar al usuario en la base de datos
        await db.registerUserDB(username, password, full_name, email, phone, security_question, security_answer);

        await db.logAction(username, 'Registro', 'Exitoso');
        // Redirigir al usuario a la página de inicio de sesión
        res.redirect('/login');

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        db.logAction(username, 'Registro', 'Fallido');
        // Manejar el error de alguna manera, como renderizar una página de error o redirigir a otra página
        res.status(500).send('Error al registrar usuario');
    }
}



async function loginUser(req, res) {
    try {
        // Obtener las credenciales del formulario de inicio de sesión
        const { username, password } = req.body;

        // Obtener el número actual de intentos fallidos del usuario
        let failedAttempts = await db.getFailedVerificationAttempts(username);

        console.log("failedAttemptsLogin", failedAttempts);

        // Verificar si el usuario está verificado
        const isVerified = await db.isUserVerified(username);

        // Verificar si el usuario está bloqueado
        const isBlocked = await db.isUserBlocked(username);

        // Verificar las credenciales del usuario en la base de datos
        const isValidUser = await db.loginUserDB(username, password);

        // Verificar si el usuario está bloqueado
        if (isBlocked) {
            await db.insertFailedAttempts(username);
            await db.logAction(username, 'Inicio de sesion', 'Bloqueado');
            // Si el usuario está bloqueado, mostrar un mensaje de alerta y redirigir a la página de inicio de sesión
            res.send('<script>alert("¡Tu cuenta ha sido bloqueada! Por favor recupera cuenta."); window.location.href = "/recoverEnterEmail";</script>');
            return;
        }
        if (isValidUser) {
            // Restablecer el contador de intentos fallidos si las credenciales son válidas
            await db.resetFailedVerificationAttempts(username);

            // Generar un token de verificación
            const verificationToken = generateVerificationCode(6); // Código de 6 dígitos

            // Insertar el token en la base de datos
            await db.insertToken(username, verificationToken, new Date(Date.now() + 600000)); // Expira en 10 minutos

            // Agregar una cookie con el nombre de usuario
            res.cookie('username', username);
            await db.logAction(username, 'Inicio de sesion', 'Exitoso');

            if (!isVerified) {
                await db.logAction(username, 'Inicio de sesion', 'Verificacion de correo');
                const subject = '¡Bienvenido a InnovateSoft Solutions! Código de verificación para confirmar tu cuenta'
                const emailText = '¡Hola!\n\nGracias por registrarte en InnovateSoft Solutions.\n\n Si no has solicitado este registro, puedes ignorar este correo electrónico.\n\nPara completar tu registro, por favor confirma tu correo electrónico ingresando el siguiente código:';

                await sendVerificationEmail(username, verificationToken, subject, emailText);
                // Si el usuario no está verificado, mostrar un mensaje de alerta y redirigir a la página de inicio de sesión
                res.send('<script>alert("¡Tu cuenta no ha sido verificada! Por favor verifica tu correo electronico."); window.location.href = "/userVerificationEmail";</script>');
            } else {
                const subject = '¡Bienvenido a InnovateSoft Solutions! Código de verificación para iniciar sesión'
                const emailText = '¡Hola!\n\nGracias por elegir InnovateSoft Solutions para tus necesidades de desarrollo. \n\n Utiliza este código para verificar tu cuenta e iniciar sesión en nuestra plataforma.\n\n¡Esperamos verte pronto y ayudarte a alcanzar tus objetivos!\n\nAtentamente,\nEquipo de InnovateSoft Solutions\n\nTu código de verificación es:';
                // Enviar el código de verificación por correo electrónico
                await sendVerificationEmail(username, verificationToken, subject, emailText);
                // Redirigir al usuario a la página donde puede ingresar el código de verificación
                res.redirect('/verify');
            }
        } else {
            // Incrementar el contador de intentos fallidos solo si las credenciales son inválidas
            failedAttempts += 1;
            await db.insertFailedAttempts(username);
            await db.logAction(username, 'Inicio de sesion', 'Fallido');
            if (failedAttempts >= 3) {
                // Bloquear la cuenta si se han excedido los intentos fallidos
                await db.blockUserAccount(username);
                await db.logAction(username, 'Bloqueo', 'Exitoso');
                res.send('<script>alert("¡Cuenta bloqueada! Ha excedido el límite de intentos de verificación fallidos."); window.location.href = "/login";</script>');
            } else {
                // Enviar una SweetAlert de error si las credenciales son inválidas
                res.send('<script>alert("¡Credenciales inválidas!"); window.location.href = "/login";</script>');
            }
        }
    } catch (error) {
        // Enviar una SweetAlert de error en caso de excepción
        console.error('Error al iniciar sesión:', error);
        res.send('<script>alert("¡Ocurrió un error al iniciar sesión!"); window.location.href = "/login";</script>');
    }
}

async function getUserInfo(req, res) {
    try {
        const username = req.cookies.username;
        const userInfo = await db.getUserInfoDB(username);
        console.log("getUserInfo", userInfo);
        if (userInfo) {
            res.status(200).json({
                id_user: userInfo.id_user,
                full_name: userInfo.full_name,
                email: userInfo.email,
                username: userInfo.username,
                phone: userInfo.phone
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
        const price = req.body.price;
        const username = req.cookies.username;

        // Comprar el servicio
        await db.buyServicesDB(service, username, price);

        await db.logAction(username, `Añadio a carrito ${service}`, 'Exitosamente');
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
            console.log("showCard", cardInfoArray);
        } else {
            res.status(404).json({ error: 'Informacion de carrito no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener la información del carrito:', error);
        res.status(500).json({ error: 'Se produjo un error al procesar la solicitud' });
    }
}

async function showServices(req, res) {
    try {
        const username = req.cookies.username;
        const servicesInfoArray = await db.showServicesDB(username);
        if (servicesInfoArray && servicesInfoArray.length > 0) {
            res.status(200).json(servicesInfoArray);
            console.log("showServices", servicesInfoArray);
        } else {
            res.status(404).json({ error: 'Informacion de carrito no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener la información del carrito:', error);
        res.status(500).json({ error: 'Se produjo un error al procesar la solicitud' });
    }
}

function generateVerificationCode(length) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);

}

async function sendVerificationEmail(username, verificationCode, subject, emailText) {
    try {
        // Obtener el correo electrónico asociado al nombre de usuario
        const email = await db.getEmail(username);

        // Configurar el transportador de correo electrónico
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'emailsproyectopython@gmail.com',
                pass: 'npglayqvauxdpyhq'
            }
        });

        // Configurar el contenido del correo electrónico
        const mailOptions = {
            from: 'emailsproyectopython@gmail.com',
            to: email, // Correo electrónico del destinatario
            subject: subject,
            text: `${emailText} ${verificationCode}`
        };


        console.log("Codigo", verificationCode);
        // Enviar el correo electrónico
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error al enviar el correo electrónico de verificación:', error);
        throw error;
    }
}


async function verifyCode(req, res) {
    try {
        const username = req.cookies.username;
        const verificationCode = req.body.verificationCode;

        // Obtener el número actual de intentos fallidos del usuario
        let failedAttempts = await db.getFailedVerificationAttempts(username);
        console.log("failedAttemptsVerify", failedAttempts);
        // Verificar si el código de verificación es válido
        const isValidToken = await db.getTokenByUsernameAndToken(username, verificationCode);

        if (isValidToken) {
            await sendVerificationEmail(username, '', '¡Inicio de sesión exitoso!', '¡Hola!\n\n¡Has iniciado sesión exitosamente en InnovateSoft Solutions!\n\n¡Esperamos verte pronto y ayudarte a alcanzar tus objetivos!\n\nAtentamente,\nEquipo de InnovateSoft Solutions');
            // Restablecer el contador de intentos fallidos si la verificación es exitosa
            await db.resetFailedVerificationAttempts(username);
            await db.logAction(username, 'Verificacion', 'Exitosa');
            res.send('<script>alert("¡Código de verificación válido! ¡Inicio de sesión exitoso!"); window.location.href = "/buyServices";</script>');
        } else {
            // Incrementar el contador de intentos fallidos
            failedAttempts += 1;
            await db.insertFailedAttempts(username);

            await db.logAction(username, 'Verificacion', 'Fallida');
            // Verificar si el usuario ha excedido el límite de intentos fallidos (por ejemplo, 3)
            if (failedAttempts >= 3) {
                // Bloquear la cuenta si se han excedido los intentos fallidos
                await db.blockUserAccount(username);
                await db.logAction(username, 'Bloqueo', 'Exitoso');
                res.send('<script>alert("¡Cuenta bloqueada! Ha excedido el límite de intentos de verificación fallidos."); window.location.href = "/recoverEnterEmail";</script>');
            } else {
                res.send('<script>alert("¡Código de verificación inválido!"); window.location.href = "/verify";</script>');
            }
        }
    } catch (error) {
        console.error('Error al verificar el código de verificación:', error);
        res.status(500).send('Error interno del servidor');
    }
}

async function verifyUserEmail(req, res) {
    const username = req.cookies.username;
    const verificationEmailCode = req.body.verificationEmailCode;

    // Verificar si el código de verificación es válido
    const isValidToken = await db.getTokenByUsernameAndToken(username, verificationEmailCode);

    if (isValidToken) {
        await db.verifyUserEmail(username);
        await db.logAction(username, 'Verificacion de correo', 'Exitosa');
        res.send('<script>alert("¡Correo Verificado! ¡Ya puedes iniciar sesión con tus credenciales!"); window.location.href = "/login";</script>');
    } else {
        res.send('<script>alert("¡Código de verificación inválido!"); window.location.href = "/userVerifyEmail";</script>');

    }
}


async function recoverEnterEmail(req, res) {
    const recoverEmail = req.body.recoverEmail;

    // Generar un token de verificación
    const verificationToken = generateVerificationCode(6); // Código de 6 dígitos

    const username = await db.getUsernameByEmail(recoverEmail);

    console.log("username", username);

    // Insertar el token en la base de datos
    await db.insertToken(username, verificationToken, new Date(Date.now() + 600000)); // Expira en 10 minutos

    // Agregar una cookie con el nombre de usuario
    res.cookie('username', username);

    await db.logAction(username, 'Recuperar ingreso email', 'Exitoso');

    const subject = '¡Bienvenido a InnovateSoft Solutions! Código de verificación para recuperar tu cuenta'
    const emailText = '¡Hola!\n\nHemos recibido una solicitud para recuperar tu cuenta en InnovateSoft Solutions.\n\nSi no has solicitado esta recuperación, puedes ignorar este correo electrónico.\n\nPara continuar con el proceso de recuperación de tu cuenta, por favor ingresa el siguiente código de verificación:';

    await sendVerificationEmail(username, verificationToken, subject, emailText);
    // Si el usuario no está verificado, mostrar un mensaje de alerta y redirigir a la página de inicio de sesión

    res.redirect("/recoverEnterCode")
}

async function verifyCodeRecover(req, res) {
    const username = req.cookies.username;
    const verificationRecoverEmailCode = req.body.recoverEmailCode;

    console.log("username", username);
    console.log("verificationRecoverEmailCode", verificationRecoverEmailCode);
    // Verificar si el código de verificación es válido
    const isValidToken = await db.getTokenByUsernameAndToken(username, verificationRecoverEmailCode);
    if (isValidToken) {
        await db.logAction(username, 'Recuperar ingreso codigo', 'Exitoso');
        res.send('<script>alert("¡Código de verificación válido! ¡Puedes recuperar tu cuenta!"); window.location.href = "/recoverQuestion";</script>');
    } else {
        res.send('<script>alert("¡Código de verificación inválido!"); window.location.href = "/recoverEnterCode";</script>');

    }
}

async function getSecurityQuestion(req, res) {
    try {
        const username = req.cookies.username;
        const securityQuestionDB = await db.getSecurityQuestionDB(username);
        console.log("getSecurityQuestion", securityQuestionDB);
        if (securityQuestionDB) {
            res.status(200).json({
                security_question: securityQuestionDB.security_question,
            });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        res.status(500).json({ error: 'Se produjo un error al procesar la solicitud' });
    }
}

async function getTotalPriceByUsername(req, res) {
    try {
        const username = req.cookies.username;
        const totalPrice = await db.getTotalPriceByUsernameDB(username);
        console.log("getTotalPriceByUsernameDB", totalPrice);
        if (totalPrice) {
            res.status(200).json({
                total_price: totalPrice.total_price,
            });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        res.status(500).json({ error: 'Se produjo un error al procesar la solicitud' });
    }
}

async function verifySecurityAnswer(req, res) {
    const username = req.cookies.username;
    const securityAnswer = req.body.securityAnswer;

    const isValidSecurityAnswer = await db.verifySecurityAnswerDB(username, securityAnswer);

    if (isValidSecurityAnswer) {
        await db.logAction(username, 'Pregunta de seguridad', 'Acertada');
        res.send('<script>alert("¡Respuesta de seguridad válida! ¡Puedes recuperar tu cuenta!"); window.location.href = "/recoverPassword";</script>');
    } else {
        await db.logAction(username, 'Pregunta de seguridad', 'Fallida');
        res.send('<script>alert("¡Respuesta de seguridad inválida!"); window.location.href = "/recoverQuestion";</script>');
    }
}

async function recoverPassword(req, res) {
    const username = req.cookies.username;
    const password = req.body.password;

    await db.recoverPasswordDB(username, password);
    await sendVerificationEmail(username, '', '¡Tu contraseña ha sido recuperada exitosamente!', '¡Hola!\n\nTu contraseña ha sido recuperada exitosamente.\n\nSi no has solicitado esta recuperación, por favor contacta a soporte.\n\n¡Esperamos verte pronto y ayudarte a alcanzar tus objetivos!\n\nAtentamente,\nEquipo de InnovateSoft Solutions');
    await db.logAction(username, 'Cambio contraseña', 'Exitoso');
    res.send('<script>alert("Cuenta recuperada exitosamente! ¡Puedes iniciar sesión!"); window.location.href = "/login";</script>');
}

async function buyCard(req, res) {
    try {
        const username = req.cookies.username;

        // Obtener los IDs de servicio y los datos de pago del cuerpo de la solicitud
        const { serviceIds, paymentData } = req.body;

        // Convertir los IDs de servicio a un array
        const serviceIdsArray = serviceIds.split(',');

        // Actualizar el estado de compra en la base de datos
        await db.buyCardDB(serviceIdsArray);

        // Parsear los datos de pago
        const paymentInfo = JSON.parse(paymentData);
        const { method, details } = paymentInfo;

        // Realizar la compra
        for (const serviceId of serviceIdsArray) {
            await db.insertPurchaseDB(serviceId, username, method, JSON.stringify(details));
        }

        await db.logAction(username, `Compra de ${serviceIdsArray}`, 'Exitosa');
        // Enviar una respuesta al cliente
        res.send('<script>alert("Servicios comprados correctamente, por favor ingresa a Mis servicios para darle seguimiento"); window.location.href = "/myServices";</script>');
    } catch (error) {
        console.error('Error al procesar la compra:', error);
        res.status(500).json({ error: 'Se produjo un error al procesar la compra' });
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
    generateVerificationCode,
    sendVerificationEmail,
    verifyCode,
    verifyCodeRecover,
    recoverEnterEmail,
    verifyUserEmail,
    getSecurityQuestion,
    verifySecurityAnswer,
    recoverPassword,
    buyCard,
    getTotalPriceByUsername,
    showServices,
    obtenerValorCompra,
    obtenerValorVenta,
    buscarPersona,
};