const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventSchema = new Schema({
    user: { type: mongoose.Types.ObjectId, required: true, ref: 'user' },
    title:{ type:String,required: true },
    description:{ type:String },
    image: { type:String },
    date: { type:String }, 
    isRecurring: { type:Boolean, required: true,default: false },
}, {
    timestamps: true
});

const EventModel = mongoose.model('event', EventSchema,'events');

module.exports = EventModel;