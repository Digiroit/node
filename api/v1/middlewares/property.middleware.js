const _ = require('lodash');
const errorFunction = require('../../../utils/apiErrorFunction');
// 

exports.postProperty = (req, res, next) => {
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
