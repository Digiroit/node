const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @swagger
 * api/v1/login:
 *   post:api/v1/
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
*/
router.post('/login', authController.login);

router.post('/signup', authMiddleware.signup, authController.signup);

router.post('/forgotPassword', authController.forgotPassword);

router.post('/changePassword', authMiddleware.authMiddleware, authController.changePassword);

router.get('/checkUsername/:username', authController.checkUsername);

module.exports = router;
