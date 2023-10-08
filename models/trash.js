const mongoose = require('mongoose');
const { Schema } = mongoose;

const _ = require('lodash');
const bcrypt = require("bcrypt-nodejs");
const jwtUtils = require('../utils/jwt.js');


const TrashSchema = new Schema({
    userId: { type: mongoose.Types.ObjectId, required: true },
    object: { type: Object, required: true },
    type: { type: String, required: true, enum: ['USER'] },
    permanentDeleted: { type: Boolean, default: false, required: true },
}, {
    timestamps: true
});


const TrashModel = mongoose.model('trash', TrashSchema);

module.exports = TrashModel;