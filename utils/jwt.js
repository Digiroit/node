const jwt = require('jsonwebtoken');

exports.signToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRETE, { expiresIn: process.env.JWT_EXP_TIME });
};

exports.decodeToken = (token) => {
    return jwt.decode(token);
};