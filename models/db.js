const sql = require('mssql');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

// Configuración de la conexión a la base de datos
const config = {
    server: 'innovatesoftsolutions.database.windows.net',
    database: 'InnovateSoft Solutions',
    user: 'chris',
    password: 'Fisic@11',
    options: {
        encrypt: true,
        trustServerCertificate: false,
        enableArithAbort: true
    }
};

// Función para conectar a la base de datos y verificar la conexión
async function connectToDatabase() {
    try {
        // Intenta conectar con la base de datos utilizando la configuración proporcionada
        await sql.connect(config);
        console.log('Conexión establecida correctamente a la base de datos SQL Server');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}

// Función para insertar un usuario en la base de datos con contraseña encriptada
async function registerUserDB(username, password, full_name, email, phone, security_question, security_answer) {
    try {
        // Generar un hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10); // 10 es el número de rondas de hashing
        const hashedSecurityAnswer = await bcrypt.hash(security_answer, 10);

        const query = `INSERT INTO Users (username, password, full_name, email, phone, security_question, security_answer) VALUES ('${username}', '${hashedPassword}', '${full_name}', '${email}', '${phone}', '${security_question}', '${hashedSecurityAnswer}')`;
        await sql.query(query);
        console.log(`Usuario ${username} insertado correctamente en la base de datos.`);
    } catch (error) {
        console.error('Error al insertar usuario en la base de datos:', error);
        throw error; // Puedes manejar el error según sea necesario
    }
}

// Controlador para manejar la solicitud de inicio de sesión
async function loginUserDB(username, password) {
    try {
        // Realiza una consulta SQL para buscar un usuario con el nombre de usuario proporcionado
        const query = `SELECT password FROM Users WHERE username = '${username}' AND status = 'active'`;

        // Ejecuta la consulta
        const result = await sql.query(query);

        // Si la consulta devuelve algún resultado
        if (result && result.recordset.length > 0) {
            // Compara la contraseña encriptada almacenada en la base de datos con la contraseña proporcionada
            const hashedPasswordFromDB = result.recordset[0].password;
            const isValidPassword = await bcrypt.compare(password, hashedPasswordFromDB);
            return isValidPassword; // Devuelve true si las contraseñas coinciden, de lo contrario false
        } else {
            return false; // No se encontró ningún usuario con el nombre de usuario proporcionado
        }
    } catch (error) {
        console.error('Error al verificar las credenciales del usuario:', error);
        throw error; // Puedes manejar el error según sea necesario
    }
}

async function isUsernameTaken(username) {
    try {
        const pool = await sql.connect(config);
        const query = `
            SELECT username
            FROM Users
            WHERE username = '${username}'
        `;
        const result = await pool.request().query(query);
        // Si la consulta devuelve algún resultado, significa que las credenciales son válidas
        if (result && result.recordset.length > 0) {
            return true; // El usuario existe
        } else {
            return false; // El usuario no existe
        }
    } catch (error) {
        console.error('Error al verificar el estado del usuario:', error);
        throw error;
    }
}

async function isUserVerified(username) {
    try {
        const pool = await sql.connect(config);
        const query = `
            SELECT verification
            FROM Users
            WHERE username = '${username}' AND verification = 'verified'
        `;
        const result = await pool.request().query(query);
        // Si la consulta devuelve algún resultado, significa que las credenciales son válidas
        if (result && result.recordset.length > 0) {
            return true; // El usuario está verificado
        } else {
            return false; // El usuario no está verificado
        }
    } catch (error) {
        console.error('Error al verificar el estado del usuario:', error);
        throw error;
    }
}

async function getUserInfoDB(username) {
    try {
        // Realiza una consulta SQL para obtener la ID y el nombre de usuario del usuario proporcionado
        const query = `SELECT id_user, full_name, email, username, phone FROM Users WHERE username = '${username}'`;

        // Ejecuta la consulta
        const result = await sql.query(query);

        // Si la consulta devuelve algún resultado, retorna la ID y el nombre de usuario
        if (result && result.recordset.length > 0) {
            const userInfo = {
                id_user: result.recordset[0].id_user,
                full_name: result.recordset[0].full_name,
                email: result.recordset[0].email,
                username: result.recordset[0].username,
                phone: result.recordset[0].phone
            };
            console.log(`Información de ${username} obtenida de la base de datos.`);
            return userInfo;
        } else {
            return null; // No se encontró ningún usuario con el nombre de usuario proporcionado
        }
    } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        throw error;
    }
}

async function buyServicesDB(service, username, price) {
    try {
        // Realiza una consulta SQL para insertar el servicio en la tabla Services
        const query = `
            INSERT INTO Services (service, username, price) VALUES ('${service}', '${username}', '${price}')`;

        // Ejecuta la consulta
        await sql.query(query);

        //updateServicePrices();

        // Retorna un mensaje de éxito
        console.log(`Servicio ${service} comprado por ${username} e insertado en la base de datos.`);
    } catch (error) {
        console.error('Error al comprar el servicio:', error);
        throw error;
    }
}

async function showCardDB(username) {
    try {
        // Realiza una consulta SQL para obtener la ID y el nombre de usuario del usuario proporcionado
        const query = `SELECT id, service FROM Services WHERE username = '${username}' and purchase_status = 'pending'`;

        // Ejecuta la consulta
        const result = await sql.query(query);

        // Si la consulta devuelve algún resultado, construye un array de objetos cardInfo
        if (result && result.recordset.length > 0) {
            const cardInfoArray = result.recordset.map(record => ({
                id: record.id,
                service: record.service
            }));
            console.log(`Información del carrito de ${username} obtenida de la base de datos.`);
            return cardInfoArray;
        } else {
            return []; // Devuelve un array vacío si no se encontraron registros
        }
    } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        throw error;
    }
}

async function showServicesDB(username) {
    try {
        // Realiza una consulta SQL para obtener la ID y el nombre de usuario del usuario proporcionado
        const query = `SELECT id, service FROM Services WHERE username = '${username}' and purchase_status = 'purchased'`;

        // Ejecuta la consulta
        const result = await sql.query(query);

        // Si la consulta devuelve algún resultado, construye un array de objetos cardInfo
        if (result && result.recordset.length > 0) {
            const servicesInfoArray = result.recordset.map(record => ({
                id: record.id,
                service: record.service
            }));
            console.log(`Información del carrito de ${username} obtenida de la base de datos.`);
            return servicesInfoArray;
        } else {
            return []; // Devuelve un array vacío si no se encontraron registros
        }
    } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        throw error;
    }
}

async function insertToken(username, token, expirationTime) {
    try {
        deletePreviousTokens(username);
        const pool = await sql.connect(config);
        const formattedExpirationTime = expirationTime.toISOString(); // Convierte el objeto de fecha a una cadena ISO
        const query = `
            INSERT INTO Tokens (username, token, expiration_time) 
            VALUES ('${username}', '${token}', '${formattedExpirationTime}')
        `;
        const result = await pool.request().query(query);
        console.log(`Token de ${username} insertado en la base de datos.`);
        return result.rowsAffected > 0;
    } catch (error) {
        console.error('Error al insertar token en la base de datos:', error);
        throw error;
    }
}

async function deletePreviousTokens(username) {
    try {
        const pool = await sql.connect(config);
        const query = `
            DELETE FROM Tokens 
            WHERE username = '${username}'
        `;
        const result = await pool.request().query(query);
        console.log(`Tokens anteriores eliminados para el usuario ${username}`);
    } catch (error) {
        console.error('Error al eliminar tokens anteriores de la base de datos:', error);
        throw error;
    }
}

async function getTokenByUsernameAndToken(username, token) {
    try {
        const pool = await sql.connect(config);
        const query = `
            SELECT * FROM Tokens 
            WHERE username = '${username}' AND token = '${token}' AND expiration_time > GETDATE()
        `;
        const result = await pool.request().query(query);
        return result.recordset[0];
        console.log(`Token de ${username} obtenido de la base de datos.`);
    } catch (error) {
        console.error('Error al obtener token de la base de datos:', error);
        throw error;
    }
}

async function getEmail(username) {
    try {
        // Realiza una consulta SQL para obtener el correo electrónico del usuario
        const query = `SELECT email FROM Users WHERE username = '${username}'`;

        // Ejecuta la consulta
        const result = await sql.query(query);

        // Si la consulta devuelve algún resultado, retorna el correo electrónico
        if (result && result.recordset.length > 0) {
            return result.recordset[0].email;
        } else {
            return null; // No se encontró ningún usuario con el nombre de usuario proporcionado
        }
        console.log(`Correo electrónico de ${username} obtenido de la base de datos.`);
    } catch (error) {
        console.error('Error al obtener el correo electrónico del usuario:', error);
        throw error;
    }
}

async function logAction(username, action, details) {
    try {
        const pool = await sql.connect(config);
        const query = `
            INSERT INTO Logs (username, action, details) 
            VALUES ('${username}', '${action}', '${details}')
        `;
        await pool.request().query(query);
        console.log(`Registro de acción de ${action} insertado en la base de datos.`);
    } catch (error) {
        console.error('Error al insertar registro de acción en la base de datos:', error);
        throw error;
    }
}

async function insertFailedAttempts(username) {
    try {
        const pool = await sql.connect(config);
        const query = `
            INSERT INTO VerificationAttempts (username, action)
            VALUES ('${username}', 'Fallida')
        `;
        await pool.request().query(query);
        console.log(`Registro de intento de verificación fallido de ${username} insertado en la base de datos.`);
    } catch (error) {
        console.error('Error al insertar registro de VerificationAttempts en la base de datos:', error);
        throw error;
    }
}


async function getFailedVerificationAttempts(username) {
    try {
        const pool = await sql.connect(config);
        const query = `
            SELECT COUNT(*) AS failedAttempts
            FROM VerificationAttempts
            WHERE username = '${username}' and action = 'Fallida'
        `;
        const result = await pool.request().query(query);
        console.log(`Intentos de verificación fallidos de ${username} obtenidos de la base de datos.`);
        return result.recordset[0].failedAttempts;
    } catch (error) {
        console.error('Error al obtener intentos de verificación fallidos:', error);
        throw error;
    }
}

async function verifyUserEmail(username) {
    try {
        const pool = await sql.connect(config);
        const query = `
            UPDATE Users
            SET verification = 'verified'
            WHERE username = '${username}'
        `;
        const result = await pool.request().query(query);
        return result.rowsAffected > 0;
    } catch (error) {
        console.error('Error al verificar el correo electrónico del usuario:', error);
        throw error;
    }
}

async function resetFailedVerificationAttempts(username) {
    try {
        const pool = await sql.connect(config);
        const query = `
            UPDATE VerificationAttempts
            SET action = 'Verificado'
            WHERE username = '${username}' AND action = 'Fallida'
        `;
        const result = await pool.request().query(query);
        console.log(`Intentos de verificación fallidos de ${username} restablecidos en la base de datos.`);
        return result.rowsAffected > 0;
    } catch (error) {
        console.error('Error al actualizar los intentos de verificación fallidos:', error);
        throw error;
    }
}

async function blockUserAccount(username) {
    try {
        const pool = await sql.connect(config);
        const query = `
            UPDATE Users
            SET status = 'inactive'
            WHERE username = '${username}'
        `;
        const result = await pool.request().query(query);
        return result.rowsAffected > 0;
    } catch (error) {
        console.error('Error al bloquear la cuenta del usuario:', error);
        throw error;
    }
}

async function isUserBlocked(username) {
    try {
        const pool = await sql.connect(config);
        const query = `
            SELECT status
            FROM Users
            WHERE username = '${username}' AND status = 'inactive'
        `;
        const result = await pool.request().query(query);
        return result.recordset.length > 0;
    } catch (error) {
        console.error('Error al verificar el estado del usuario:', error);
        throw error;
    }
}

async function getUsernameByEmail(email) {
    try {
        // Realiza una consulta SQL para obtener el correo electrónico del usuario
        const query = `SELECT username FROM Users WHERE email = '${email}'`;

        // Ejecuta la consulta
        const result = await sql.query(query);

        // Si la consulta devuelve algún resultado, retorna el correo electrónico
        if (result && result.recordset.length > 0) {
            return result.recordset[0].username;
        } else {
            return null; // No se encontró ningún usuario con el nombre de usuario proporcionado
        }
    } catch (error) {
        console.error('Error al obtener el correo electrónico del usuario:', error);
        throw error;
    }
}

async function getSecurityQuestionDB(username) {
    try {
        const query = `
            SELECT security_question
            FROM Users
            WHERE username = '${username}'
        `;

        const result = await sql.query(query);

        if (result && result.recordset.length > 0) {
            const securityQuestionDB = {
                security_question: result.recordset[0].security_question
            };
            return securityQuestionDB;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al obtener la pregunta de seguridad:', error);
        throw error;
    }
}

async function getTotalPriceByUsernameDB(username) {
    try {
        const query = `
            SELECT SUM(price) AS total_price
            FROM Services
            WHERE username = '${username}' and purchase_status = 'pending'
        `;

        const result = await sql.query(query);

        if (result && result.recordset.length > 0) {
            const totalPrice = {
                total_price: result.recordset[0].total_price || 0
            }; // Obtener la suma de precios o cero si no hay resultados
            return totalPrice;
        } else {
            return { total_price: 0 }; // Si no hay servicios para el usuario, retornar cero
        }
    } catch (error) {
        console.error('Error al obtener el total de precios:', error);
        throw error;
    }
}




async function verifySecurityAnswerDB(username, securityAnswer) {
    try {
        // Realiza una consulta SQL para buscar un usuario con el nombre de usuario proporcionado
        const query = `SELECT security_answer FROM Users WHERE username = '${username}'`;

        // Ejecuta la consulta
        const result = await sql.query(query);

        // Si la consulta devuelve algún resultado
        if (result && result.recordset.length > 0) {
            // Compara la respuesta de seguridad almacenada en la base de datos con la proporcionada por el usuario
            const hashedSecurityAnswerFromDB = result.recordset[0].security_answer;
            const isValidSecurityAnswer = await bcrypt.compare(securityAnswer, hashedSecurityAnswerFromDB);
            return isValidSecurityAnswer; // Devuelve true si las respuestas coinciden, de lo contrario false
        } else {
            return false; // No se encontró ningún usuario con el nombre de usuario proporcionado
        }
    } catch (error) {
        console.error('Error al verificar la respuesta de seguridad del usuario:', error);
        throw error; // Puedes manejar el error según sea necesario
    }
}


async function recoverPasswordDB(username, password) {
    try {
        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(password, 10); // 10 es el número de rondas de hashing

        // Actualizar la contraseña en la base de datos
        const updatePasswordQuery = `
            UPDATE Users
            SET password = '${hashedPassword}'
            WHERE username = '${username}'
        `;
        await sql.query(updatePasswordQuery);

        // Actualizar el estado de verificación del usuario a "verificado"
        const updateStatusQuery = `
            UPDATE Users
            SET status = 'active'
            WHERE username = '${username}'
        `;
        await sql.query(updateStatusQuery);

        resetFailedVerificationAttempts(username);

        // Si todo se realizó correctamente, retornar true para indicar éxito
        return true;
    } catch (error) {
        console.error('Error al recuperar la contraseña del usuario:', error);
        throw error;
    }
}

async function buyCardDB(serviceIdsArray) {
    try {
        // Convertir los IDs de servicio a una cadena separada por comas para usar en la consulta SQL
        const serviceIdsString = serviceIdsArray.join(',');

        console.log('serviceIdsString:', serviceIdsString);

        // Query para actualizar el estado de compra en la tabla Services
        const query = `
            UPDATE Services
            SET purchase_status = 'purchased'
            WHERE id IN (${serviceIdsString})
        `;

        // Ejecutar la consulta SQL
        await sql.query(query);

        // Devolver un mensaje de éxito
        return { message: 'Estado de compra actualizado con éxito' };
    } catch (error) {
        console.error('Error al actualizar el estado de compra en la base de datos:', error);
        throw error;
    }
}

async function insertPurchaseDB(serviceId, username, paymentMethod, paymentMethodData) {
    try {
        // Encriptar los datos del método de pago utilizando bcrypt
        const hashedPaymentMethodData = await bcrypt.hash(paymentMethodData, 10); // 10 es el número de rondas de hashing

        const query = `
            INSERT INTO purchases (service_id, username, payment_method, payment_method_data)
            VALUES (${serviceId}, '${username}', '${paymentMethod}', '${hashedPaymentMethodData}');
        `;
        await sql.query(query);
        console.log('Compra registrada en la base de datos.');
    } catch (error) {
        console.error('Error al insertar la compra en la base de datos:', error);
        throw error;
    }
}

async function getLocationData() {
    try {
        const locationData = await Location.findAll();

        // Convertir los datos a formato JSON
        const jsonData = locationData.map(location => {
            return {
                id_location: location.id_location,
                province: location.province,
                canton: location.canton,
                district: location.district
            };
        });

        return jsonData;
    } catch (error) {
        console.error('Error al obtener datos de ubicación:', error);
        throw error;
    }
}

async function buscarPersonaDB(fullName) {
    try {
        // Realiza una consulta SQL para obtener la información de la persona proporcionada
        const query = `SELECT id_person, full_name, email, phone, provincias, cantones, distritos FROM Persons WHERE full_name = '${fullName}'`;

        // Ejecuta la consulta
        const result = await sql.query(query);

        // Si la consulta devuelve algún resultado, retorna la información de la persona
        if (result && result.recordset.length > 0) {
            const personaInfo = {
                id_person: result.recordset[0].id_person,
                full_name: result.recordset[0].full_name,
                email: result.recordset[0].email,
                phone: result.recordset[0].phone,
                provincias: result.recordset[0].provincias,
                cantones: result.recordset[0].cantones,
                distritos: result.recordset[0].distritos
            };
            console.log(`Información de ${fullName} obtenida de la base de datos.`);
            return personaInfo;
        } else {
            return null; // No se encontró ninguna persona con el nombre proporcionado
        }
    } catch (error) {
        console.error('Error al obtener la información de la persona:', error);
        throw error;
    }
}

connectToDatabase();

// Exporta la función para que esté disponible en otros archivos
module.exports = {
    connectToDatabase,
    registerUserDB,
    loginUserDB,
    getUserInfoDB,
    buyServicesDB,
    showCardDB,
    insertToken,
    getTokenByUsernameAndToken,
    getEmail,
    logAction,
    getFailedVerificationAttempts,
    insertFailedAttempts,
    resetFailedVerificationAttempts,
    blockUserAccount,
    isUserBlocked,
    isUserVerified,
    verifyUserEmail,
    getUsernameByEmail,
    getSecurityQuestionDB,
    verifySecurityAnswerDB,
    recoverPasswordDB,
    getTotalPriceByUsernameDB,
    buyCardDB,
    insertPurchaseDB,
    showServicesDB,
    isUsernameTaken,
    buscarPersonaDB
};
