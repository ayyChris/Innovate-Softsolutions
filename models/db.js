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

async function insertUser(username, password) {
    try {
        const query = `INSERT INTO Users (username, password) VALUES ('${username}', '${password}')`;
        await sql.query(query);
        console.log(`Usuario ${username} insertado correctamente en la base de datos.`);
    } catch (error) {
        console.error('Error al insertar usuario en la base de datos:', error);
        throw error; // Puedes manejar el error según sea necesario
    }
}

connectToDatabase();

// Exporta la función para que esté disponible en otros archivos
module.exports = {
    connectToDatabase,
    insertUser
};
