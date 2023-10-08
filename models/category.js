const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    isRoot: { type: Boolean, required: true, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('category', CategorySchema,'categories');