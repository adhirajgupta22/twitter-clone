const express  = require('express');
const {ProfileMiddleware} = require('../middlewares/profile.middleware');
const {getNotifications,deleteNotifications} = require('../controllers/notification.controller');

const router = express.Router();

router.get('/',ProfileMiddleware,getNotifications);
router.delete('/',ProfileMiddleware,deleteNotifications);

module.exports = router;