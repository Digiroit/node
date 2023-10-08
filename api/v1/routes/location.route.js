const express = require('express');
const router = express.Router();
const locationController = require('./../controllers/location.controller');


router
    .route('/country')
    .get(locationController.getCountryList);

router
    .route('/state/:countryCode')
    .get(locationController.getStatesOfCountry);

router
    .route('/city/:countryCode/:stateCode')
    .get(locationController.getCitiesOfState);


module.exports = router;
