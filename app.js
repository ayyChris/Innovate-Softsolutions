const express = require('express');
const session = require('express-session');
const path = require('path');
const homeController = require('./controllers/homeController');

const app = express();

/// Configurar middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configurar middleware para el manejo de datos JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const secretKey = 'mi-clave-secreta-ultrasegura-y-aleatoria';

app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true
}));

// Configurar una ruta para la página de registro y asignar el controlador
app.post('/register', homeController.registerUser);

// Configurar una ruta para la página de inicio de sesión y asignar el controlador
app.post('/login', homeController.loginUser);

// Configurar una ruta para servir los archivos HTML desde la carpeta 'views'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/service', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'service.html'));
});

app.get('/why', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'why.html'));
});

app.get('/team', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'team.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Escucha en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});
