const express = require('express');
const router = express.Router();

const searchController = require('./../controllers/search.controller');

/**
 * @swagger
 * api/v1/:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
*/
router
    .get('/', searchController.querySearch);



module.exports = router;
