const requestIp = require('request-ip');
 
const ipMiddleware = function(req, res, next) {
    // inside middleware handler
    const clientIp = requestIp.getClientIp(req);
    req.clientIp = clientIp;
    next();
};

module.exports = ipMiddleware; 