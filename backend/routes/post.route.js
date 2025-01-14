const express = require('express');
const {ProfileMiddleware} = require('../middlewares/profile.middleware');
const {createPost,deletePost,commentOnPost,likeUnlikePost,getAllPosts,getLikedPosts,getFollowingPosts,getUserPosts} = require('../controllers/post.controller');

const router = express.Router();

router.post('/create', ProfileMiddleware, createPost);
router.delete('/:id',ProfileMiddleware,deletePost); 
router.post('/comment/:id',ProfileMiddleware,commentOnPost);
router.post('/like/:id',ProfileMiddleware,likeUnlikePost);
router.get('/all',ProfileMiddleware,getAllPosts);
router.get('/likes/:id',ProfileMiddleware,getLikedPosts);  //this controller is to get the liked posts of a user and id is of user here
router.get('/following',ProfileMiddleware,getFollowingPosts);  //this controller is to get the posts of the users whom the logged in user is following
router.get('/user/:username',ProfileMiddleware,getUserPosts);  

module.exports = router;