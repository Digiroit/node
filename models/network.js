const mongoose = require('mongoose');
const { Schema } = mongoose;

const _ = require('lodash');
const bcrypt = require("bcrypt-nodejs");
const jwtUtils = require('../utils/jwt.js');

const NetworkSchema = new Schema({
    followerUserId: { type: mongoose.Types.ObjectId, required: true },
    followingUserId: { type: mongoose.Types.ObjectId, required: true }
}, {
    timestamps: true
});

const NetworkModel = mongoose.model('network', NetworkSchema,'networks');

module.exports = NetworkModel;