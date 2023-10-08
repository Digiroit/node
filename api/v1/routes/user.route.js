const express = require('express');
const router = express.Router();

const userController = require('./../controllers/user.controller');


/**
 * @swagger
 * api/v1/:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
*/
router.get('/:userId', userController.getUserData);

router.post('/', userController.updateUser);
router.post('/update-password', userController.updatePassword);




module.exports = router;
