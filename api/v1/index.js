const express = require('express');
const router = express.Router();
const cors = require('cors');

const dashboardRouter = require('./routes/dashboard.route');
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const profileRouter = require('./routes/profile.route');
// const propertyRouter = require('./routes/property.route');
const imageRouter = require('./routes/image.route');
const locationRouter = require('./routes/location.route');
const eventRouter = require('./routes/event.route');
const authMiddleware = require('./middlewares/auth.middleware');

// base url : /api/v1/
router.get('/',(req,res)=>{
    res.send('Got it');
})


//auth routes
router.use('/auth', authRouter);

//dashbord routes
router.use('/dashboard',authMiddleware.authMiddleware, dashboardRouter);

//search routes
// authMiddleware.authMiddleware
router.use('/search', dashboardRouter);

//profile routes 
router.use('/profile', authMiddleware.authMiddleware, profileRouter);

//user routes 
// 1. get user profile
// 2. update profile
// 3. update profile image
router.use('/user',authMiddleware.authMiddleware, userRouter);

// event routes 
// 1. get all events user id
// 2. create new event
// 3. update existing event
// 4. delete event
router.use('/event',authMiddleware.authMiddleware, eventRouter);



//post routes
// 1. get post
// 2. post post 
// 3. update post
// 4. like post
// 5. comment on post 
// 6. search post - by caption or hash tags
// 7. delete post
// 8. save post
// 9. report post 
// 10. get all posts from a user

//network routes
// 1. get network of a user
// 2. follow/unfollow someone 
// 3. block/unblock someone






//property routes
// authMiddleware.authMiddleware
// router.use('/property',authMiddleware.authMiddleware, propertyRouter);

//image routes
router.use('/image', imageRouter);

//location routes
router.use('/location', locationRouter);

//end request if no route matched
router.use('*', (req, res, next) => {
    console.log('API 404');
    res.status(404).send();
    // res.destroy();
});

module.exports = router;
