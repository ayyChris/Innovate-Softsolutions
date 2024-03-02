const sql = require('mssql');

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

async function registerUserDB(username, password) {
    try {
        const query = `INSERT INTO Users (username, password) VALUES ('${username}', '${password}')`;
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
        const query = `SELECT * FROM Users WHERE username = '${username}' AND password = '${password}'`;

        // Ejecuta la consulta
        const result = await sql.query(query);

        // Si la consulta devuelve algún resultado, significa que las credenciales son válidas
        if (result && result.recordset.length > 0) {
            return true; // Las credenciales son válidas
        } else {
            return false; // Las credenciales no son válidas
        }
    } catch (error) {
        console.error('Error al verificar las credenciales del usuario:', error);
        throw error; // Puedes manejar el error según sea necesario
    }
}

async function getUserInfoDB(username) {
    try {
        // Realiza una consulta SQL para obtener la ID y el nombre de usuario del usuario proporcionado
        const query = `SELECT idUser, username FROM Users WHERE username = '${username}'`;

        // Ejecuta la consulta
        const result = await sql.query(query);

        // Si la consulta devuelve algún resultado, retorna la ID y el nombre de usuario
        if (result && result.recordset.length > 0) {
            const userInfo = {
                idUser: result.recordset[0].idUser,
                username: result.recordset[0].username
            };
            return userInfo;
        } else {
            return null; // No se encontró ningún usuario con el nombre de usuario proporcionado
        }
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
        console.log(`Servicio ${service} comprado por el usuario ${username} correctamente.`);
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
    } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
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
    showCardDB
};
