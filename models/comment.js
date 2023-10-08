const mongoose = require('mongoose');
const { Schema } = mongoose;

const _ = require('lodash');
const bcrypt = require("bcrypt-nodejs");
const jwtUtils = require('../utils/jwt.js');

const CommentSchema = new Schema({
    postId: { type: mongoose.Types.ObjectId, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    comment: { type: String, required: true },
    commentId: { type: mongoose.Types.ObjectId, required: true },
    isReply: { type: Boolean, default:false },
}, {
    timestamps: true
});

const CommentModel = mongoose.model('comment', CommentSchema,'comments');

module.exports = CommentModel;