const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const secretKey = 'bon';

const db = require ('./db/db');
const {traitLogout, showDelete, traitDelete} = require('./controllers/userController');
const {authMiddleware, admin} = require('./middlewares/authMiddleware');
const userRouter = require('./routes/userRoute');
const produitRouter = require('./routes/produitRoute');
const annonceRouter = require('./routes/annonceRoute');

const port = 3000;
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));
app.use(userRouter);
app.use(produitRouter);
app.use(annonceRouter);

app.post('/logout', (req, res) => {
    traitLogout (req,res);
});

app.get ('/delete', authMiddleware, admin, (req,res) =>{
    showDelete (req,res);
});

app.post('/delete', authMiddleware, admin, (req, res) => {
    traitDelete (req,res);
});

app.listen(port,()=>{
    console.log('Coucou');
})
