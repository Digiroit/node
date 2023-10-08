const mongoose = require('mongoose');
const { Schema } = mongoose;

const _ = require('lodash');
const bcrypt = require("bcrypt-nodejs");
const jwtUtils = require('../utils/jwt.js');

const LikeSchema = new Schema({
    postId: { type: mongoose.Types.ObjectId, required: true },
    commentId: { type: mongoose.Types.ObjectId, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
}, {
    timestamps: true
});

const LikeModel = mongoose.model('like', LikeSchema,'likes');

module.exports = LikeModel;