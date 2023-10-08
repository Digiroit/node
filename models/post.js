const mongoose = require('mongoose');
const { Schema } = mongoose;

const postType = ['VIDEO', 'IMAGE',''];
const directions = ['EAST', 'WEST', 'NORTH', 'SOUTH'];


const PostSchema = new Schema({
    publicId: { type: String, required: true, unique: true },
    caption:{type:String},
    address: {
        addressLine1: { type: String, default: '' },
        addressLine2: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        country: { type: String, default: '' },
        pin: { type: String, default: '' }
    },
    sources: { type: Array, default: [] },
    hash: { type: Array, default: [] },
    mentions: { type: Array, default: [] },
    tags: { type: Array, default: [] },
    type: { type: String, uppercase: true,default: 'IMAGE', enum: postType },
    location: {
        lat: '',
        lng: ''
    },
    postStatus:{
        isActive:{type:Boolean,required:true,default:true},
        isFeatured:{type:Boolean,required:true,default:false},
        isPro:{type:Boolean,required:true,default:false},
        isBannerPost:{type:Boolean,required:true,default:false},
        isSearchable: { type: Boolean, default: true },
        proExpiryDate:{type:Date,default:null},
        featuredExpiryDate:{type:Date,default:null},
        bannerExipryDate:{type:Date,default:null},
        isAdminBlocked: { type: Boolean, default: false },
        isAdminVerified: { type: Boolean, default: false },
    },
    postedByRole: { type: String, required: true,default:'USER', enum: ['USER', 'ADMIN'] },
    postedBy: { type: mongoose.Types.ObjectId, required: true, ref: 'users' }
}, {
    timestamps: true
});


module.exports = mongoose.model('post', PostSchema,'posts');