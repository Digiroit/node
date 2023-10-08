const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChatboxSchema = new Schema({
    name: { type: String, required: true, unique: true },
    isGroup: { type: Boolean, required: true, default: false },
    members : [{ type: mongoose.Types.ObjectId, required: true, ref: 'users'}],
    ownerUserId:{ type: mongoose.Types.ObjectId, required: true, ref: 'users'},
    isArchived:{ type:Boolean,default:false }
}, {
    timestamps: true
});

module.exports = mongoose.model('chatbox', ChatboxSchema,'chatboxs');