const express = require('express');
const router = express.Router();

const propertyController = require('./../controllers/property.controller');
/**
//  * @swagger
 * api/v1/:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
*/

router
.route('/categories')
.get(propertyController.getCategories);

router
  .post('/',
    propertyController.postProperty);

    
router
.get('/my',
  propertyController.getMyProperties);

router
  .get('/:propertyPublicId?',
    propertyController.getProperty);

router
  .route('/:propertyPublicId')
  .patch(propertyController.patchProperty)
  .delete(propertyController.deleteProperty);



module.exports = router;
