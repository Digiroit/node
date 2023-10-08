const _ = require('lodash');
const jwtUtils = require('./../../../utils/jwt');
const errorFunction = require('../../../utils/apiErrorFunction');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;

exports.authMiddleware = (req, res, next) => {
    try {
        let { authorization } = req.headers;
        
        if (!authorization)
            throw { st: 403, msg: 'Not Authorized' };
console.log(req.headers,'< headers')
        // let decodedValue = jwtUtils.decodeToken(token);
        jwt.verify(authorization, process.env.JWT_SECRETE, function (err, decoded) {
            if (err) {
                throw { st: 403, msg: 'jwt expired' }
            } else {
                console.log('====================================');
                console.log(decoded);
                console.log('====================================');
                req.userId = ObjectId(decoded._id);
                req.accountType = decoded.accountType;
                req.user = decoded;
                next();
            }
        });
    } catch (error) {
        errorFunction(res, error);

    }
}

exports.login = (req, res, next) => {
    try {
        let data = req.body;
        const array = [];
        if (!data.email?.trim())
            array.push('email');
        if (!data.password?.trim())
            array.push('password');

        if (array.length) {
            console.log(array);
            throw { st: 400, msg: 'Invalid parameters' }
        } else
            next();

    } catch (error) {
        errorFunction(res, error);
    }
}

exports.signup = (req, res, next) => {
    try {
        let data = req.body;
        const array = [];
        if (!data.email?.trim())
            array.push('email');
        if (!data.password?.trim())
            array.push('password');
        if (!data.name?.trim())
            array.push('name');
        if (!data.userName?.trim())
            array.push('userName');
        // if (!data.lastName?.trim())
        //     array.push('lastName');
        // if (!data.password?.trim())
        //     array.push('password');
        // if (!data.number?.trim())
        //     array.push('number');
        // if (!data.countryCode?.trim())
        //     array.push('countryCode');

        if (array.length) {
            console.log(array);
            throw { st: 400, msg: 'Invalid parameters' }
        } else
            next();

    } catch (error) {
        errorFunction(res, error);
    }
}