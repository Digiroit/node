const express = require('express');
const router = express.Router();
const requestIp = require('request-ip');
const ObjectId = require('mongoose').Types.ObjectId;
const jwt = require('jsonwebtoken');

const pageData = require('./../data/meta');
const sampelData = require('./../models/sampleData');

const ipMiddleware = require('./../utils/ip');
const ipStack = require('./../services/ipStack');
const UserModel = require('../models/users');

/* GET home page. */
router.get('/', ipMiddleware, async function (req, res, next) {
  try {
    // temp ip for localhost
    // req.clientIp = process.env.NODE_ENV === 'production' ? req.clientIp : '113.193.190.158';
    let location;
    try {
      location = (await ipStack.getLocation(req.clientIp)).data;
    } catch (err) {
      console.log(err);
    }
    console.log(location, '< location');
    res.render('index', { ...pageData.common,location });
  } catch (error) {
    console.log(error);
    res.render('index', { ...pageData.common,location, errorFlash: 'Something went wrong!' });
  }
});

// router.get('/property/:titile', function (req, res, next) {
//   let pageDetails = { ...pageData.common };
//   pageDetails['title'] = sampelData.properties[0].address.addressLine1;
//   res.render('singleProperty', { ...pageDetails, property: sampelData.properties[0] });
// });

// router.get('/agent/:titile', function (req, res, next) {
//   let pageDetails = { ...pageData.common };
//   pageDetails['title'] = sampelData.agents[0].fullName;
//   res.render('singleAgent', { ...pageDetails, agent: sampelData.agents[0] });
// });
// us-verify

router.get('/us-verify',ipMiddleware,async function (req, res, next) {
  try {
    if(req.query.t === undefined){
      throw 'error';
    }
    const token = req.query.t;
    // temp ip for localhost
    // req.clientIp = process.env.NODE_ENV === 'production' ? req.clientIp : '113.193.190.158';
    console.log('Ip ===> ', req.clientIp);
    let location;
    try {
      location = (await ipStack.getLocation(req.clientIp)).data;
    } catch (err) {
      console.log(err);
    }
    console.log(location, '< location');

    jwt.verify(token, process.env.JWT_SECRETE,async function (err, decoded) {
      if (err) {
          throw { st: 403, msg: 'jwt expired' }
      } else {
          const userId = ObjectId(decoded._id);
          let userModified = await UserModel.updateOne({_id:userId,'userStatus.isAdminBlocked':false,'accountStatus.isEmailVerified':false},{$set:{'accountStatus.isEmailVerified':true}})
          console.log(userModified.nModified)
          if(userModified.nModified){
            res.render('verify', { ...pageData.common, message: 'Email Verified Successfully! \n Please login.' });
        }else{
            res.render('verify', { ...pageData.common, message: 'Invalid Token!' });
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.render('verify', { ...pageData.common, message: 'Something went wrong!' });
  }
})

module.exports = router;
