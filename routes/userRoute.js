const express = require('express');
const router = express.Router();
const path = require('path');
const db = require ('../db/db');

const {authMiddleware} = require('../middlewares/authMiddleware');
const {getUser, showRegister, traitRegister, showLogin, traitLogin, traitLogout, showHome}  = require('../controllers/userController');



router.get ('/home', (req, res) => {
    showHome (req, res);
    })
    
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

router.post('/logout', (req, res) => {
    traitLogout (req,res);
});

module.exports = router;