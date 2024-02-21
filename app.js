const express = require('express');
const session = require('express-session');
const path = require('path');
const homeController = require('./controllers/homeController');

const app = express();

// Configurar middleware para servir archivos estáticos desde la carpeta 'public'
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

// Configurar el motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurar las rutas de tu aplicación
app.post('/register', homeController.registerUser);
app.post('/login', homeController.loginUser);

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/service', (req, res) => {
    res.render('service');
});

app.get('/why', (req, res) => {
    res.render('why');
});

app.get('/team', (req, res) => {
    res.render('team');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

// Escuchar en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});
