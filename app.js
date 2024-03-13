const express = require('express');
const session = require('express-session');
const path = require('path');
const homeController = require('./controllers/homeController');

const cookieParser = require('cookie-parser');
const app = express();

/// Configurar middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configurar middleware para el manejo de datos JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar middleware para el manejo de cookies
app.use(cookieParser());

const secretKey = 'mi-clave-secreta-ultrasegura-y-aleatoria';

app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true
}));

app.post('/register', homeController.registerUser);

app.post('/login', homeController.loginUser);

app.post('/buyServices', homeController.buyServices);



app.post('/verify', homeController.verifyCode);

app.post('/verifyCodeRecover', homeController.verifyCodeRecover);

app.post('/recoverEnterEmail', homeController.recoverEnterEmail);

app.post('/verifySecurityAnswer', homeController.verifySecurityAnswer);

app.post('/recoverPassword', homeController.recoverPassword);

app.post('/userVerificationEmail', homeController.verifyUserEmail);

app.post('/buyCard', homeController.buyCard);

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

app.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'menu.html'));
});

app.get('/userInfo', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'userInfo.html'));
});

app.get('/buyServices', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'buyServices.html'));
});

app.get('/myServices', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'myServices.html'));
});

app.get('/card', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'card.html'));
});

app.get('/verify', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'verify.html'));
});

app.get('/recoverEnterEmail', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'recoverEnterEmail.html'));
});

app.get('/recoverEnterCode', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'recoverEnterCode.html'));
});

app.get('/recoverQuestion', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'recoverQuestion.html'));
});

app.get('/recoverPassword', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'recoverPassword.html'))
});
app.get('/userVerificationEmail', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'userVerificationEmail.html'));
});



app.get('/logout', (req, res) => {
    res.clearCookie('username');
    res.redirect('/');
});

app.get('/getUserInfo', homeController.getUserInfo);

app.get('/showCard', homeController.showCard);

app.get('/showServices', homeController.showServices);

app.get('/getSecurityQuestion', homeController.getSecurityQuestion);

app.get('/getTotalPrice', homeController.getTotalPriceByUsername);
// Escucha en el puerto 3000
port = 3000
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
