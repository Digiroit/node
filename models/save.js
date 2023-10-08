const mongoose = require('mongoose');
const { Schema } = mongoose;

const _ = require('lodash');
const bcrypt = require("bcrypt-nodejs");
const jwtUtils = require('../utils/jwt.js');

const SaveSchema = new Schema({
    postId: { type: mongoose.Types.ObjectId, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
}, {
    timestamps: true
});

const SaveModel = mongoose.model('save', SaveSchema,'saves');

module.exports = SaveModel;