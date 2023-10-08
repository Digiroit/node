const errorFunction = require('../../../utils/apiErrorFunction');
const countryStateCity = require('country-state-city').default;

exports.getCountryList = async (req, res, next) => {
    try {
        let countries = countryStateCity.getAllCountries();
        res.json({
            success: true,
            data: countries
        });
    } catch (error) {
        errorFunction(res, error);
    }
};

exports.getAllStates = async (req, res, next) => {
    try {
        let states = countryStateCity.getAllStates();
        res.json({
            success: true,
            data: states
        })
    } catch (error) {
        errorFunction(res, error);
    }
};

exports.getAllCities = async (req, res, next) => {
    try {
        let city = countryStateCity.getAllCities();
        res.json({
            success: true,
            data: city
        })
    } catch (error) {
        errorFunction(res, error);
    }
};

exports.getCountryByCode = async (req, res, next) => {
    try {
        let countryCode = req.params.countryCode;
        let country = countryStateCity.getCountryByCode(countryCode);
        res.json({
            success: true,
            data: country
        })
    } catch (error) {
        errorFunction(res, error);
    }
};

exports.getStatesOfCountry = async (req, res, next) => {
    try {
        let countryCode = req.params.countryCode;
        let states = countryStateCity.getStatesOfCountry(countryCode);
        res.json({
            success: true,
            data: states
        })
    } catch (error) {
        errorFunction(res, error);
    }
};

exports.getCitiesOfState = async (req, res, next) => {
    try {
        let countryCode = req.params.countryCode;
        let stateCode = req.params.stateCode;
        let cities = countryStateCity.getCitiesOfState(countryCode, stateCode);
        res.json({
            success: true,
            data: cities
        })
    } catch (error) {
        errorFunction(res, error);
    }
};
