const express = require('express');
const {ProfileMiddleware} = require('../middlewares/profile.middleware');
const {getUserProfile,followUnfollowUser,getSuggestedUsers,updateUser} = require('../controllers/user.controller');

const router = express.Router();

router.get('profile/:username',ProfileMiddleware,getUserProfile);
router.get('/suggested',ProfileMiddleware,getSuggestedUsers);
router.post('/follow/:id',ProfileMiddleware,followUnfollowUser);
router.post('/update',ProfileMiddleware,updateUser);


module.exports = router;