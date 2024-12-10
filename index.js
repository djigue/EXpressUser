const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const secretKey = 'bon';

const db = require ('./db/db');
const {getUser, showRegister, traitRegister, showLogin, traitLogin, traitLogout, showDelete, traitDelete, showProduct,
       showPanier, traitPanier,showAnnonce} = require('./controllers/userController');
const {authMiddleware, admin} = require('./middlewares/authMiddleware');

const port = 3000;
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));

app.get('/user',authMiddleware, (req, res) => {
    getUser(req, res);
});

app.get ('/register', (req,res) =>{
    showRegister (req,res);
});

app.post('/register', (req, res) => {
    traitRegister (req,res);
});

app.get ('/login', (req,res) =>{
   showLogin (req,res);
});

app.post('/login', (req, res) => {
    traitLogin (req,res);
});

app.post('/logout', (req, res) => {
    traitLogout (req,res);
});

app.get ('/delete', authMiddleware, admin, (req,res) =>{
    showDelete (req,res);
});

app.post('/delete', authMiddleware, admin, (req, res) => {
    traitDelete (req,res);
});

app.get('/produits', authMiddleware, (req, res) => {
    showProduct (req, res);
});

app.get('/panier', authMiddleware, (req,res) => {
    showPanier (req, res);
})
app.post('/panier', authMiddleware, (req,res) => {
    traitPanier (req,res);
})

app.get('/annonce', (req,res) => {
    showAnnonce (req, res);
})

app.listen(port,()=>{
    console.log('Coucou');
})
