const axios = require('axios');

exports.getLocation = (ip)=>{
    return axios.get(`http://api.ipstack.com/${ip}?access_key=${process.env.IP_STACK_KEY}`);      
} 