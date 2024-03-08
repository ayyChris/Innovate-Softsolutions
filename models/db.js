const sql = require('mssql');
const nodemailer = require('nodemailer');

// Configuración de la conexión a la base de datos
const config = {
    user: 'sa',
    password: 'password1234567',
    server: 'localhost',
    database: 'InnovateSoft Solutions',
    options: {
        trustServerCertificate: true
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

// Función para insertar un usuario en la base de datos

async function registerUserDB(username, password, full_name, email, phone, security_question, security_answer) {
    try {
        const query = `INSERT INTO Users (username, password, full_name, email, phone, security_question, security_answer) VALUES ('${username}', '${password}', '${full_name}', '${email}', '${phone}', '${security_question}', '${security_answer}')`;
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
        // Realiza una consulta SQL para buscar un usuario con el nombre de usuario y contraseña proporcionados
        const query = `SELECT * FROM Users WHERE username = '${username}' AND password = '${password}' and status = 'active'`;

        // Ejecuta la consulta
        const result = await sql.query(query);

        // Si la consulta devuelve algún resultado, significa que las credenciales son válidas
        if (result && result.recordset.length > 0) {
            return true; // Las credenciales son válidas
        } else {
            return false; // Las credenciales no son válidas
        }
        console.log(`Credenciales de ${username} verificadas en la base de datos.`);
    } catch (error) {
        console.error('Error al verificar las credenciales del usuario:', error);
        throw error; // Puedes manejar el error según sea necesario
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
            return userInfo;
        } else {
            return null; // No se encontró ningún usuario con el nombre de usuario proporcionado
        }
        console.log(`Información de ${username} obtenida de la base de datos.`);
    } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        throw error;
    }
}

async function buyServicesDB(service, username) {
    try {
        // Realiza una consulta SQL para insertar el servicio en la tabla Services
        const query = `
            INSERT INTO Services (service, username) VALUES ('${service}', '${username}')`;

        // Ejecuta la consulta
        await sql.query(query);

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
        const query = `SELECT id, service FROM Services WHERE username = '${username}'`;

        // Ejecuta la consulta
        const result = await sql.query(query);

        // Si la consulta devuelve algún resultado, construye un array de objetos cardInfo
        if (result && result.recordset.length > 0) {
            const cardInfoArray = result.recordset.map(record => ({
                id: record.id,
                service: record.service
            }));
            return cardInfoArray;
        } else {
            return []; // Devuelve un array vacío si no se encontraron registros
        }
        console.log(`Información del carrito de ${username} obtenida de la base de datos.`);
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

async function resetFailedVerificationAttempts(username) {
    try {
        const pool = await sql.connect(config);
        const query = `
            UPDATE VerificationAttempts
            SET action = 'Recuperado'
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
    isUserBlocked
};
