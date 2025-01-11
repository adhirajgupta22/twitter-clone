const express  = require('express');
const {signup,login,logout,me} = require('../controllers/auth.controller');
const {ProfileMiddleware} = require('../middlewares/profile.middleware');

const router = express.Router();

router.get('/me',ProfileMiddleware, me); //profile page
router.post('/signup',signup); //signup page
router.post('/login',login); //login page
router.post('/logout',logout); //logout page

module.exports = router;
