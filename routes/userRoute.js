const express = require('express');
const router = express.Router();
const {getUser, showRegister, traitRegister, showLogin, traitLogin}  = require('../controllers/userController');
const db = require ('../db/db');
const {authMiddleware} = require('../middlewares/authMiddleware');
    
router.get('/user',authMiddleware, (req, res) => {
    getUser(req, res);
});

router.get ('/register', (req,res) =>{
    showRegister (req,res);
});

router.post('/register', (req, res) => {
    traitRegister (req,res);
});

router.get ('/login', (req,res) =>{
   showLogin (req,res);
});

router.post('/login', (req, res) => {
    traitLogin (req,res);
});

module.exports = router;