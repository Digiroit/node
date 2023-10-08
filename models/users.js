const mongoose = require('mongoose');
const { Schema } = mongoose;

const _ = require('lodash');
const bcrypt = require("bcrypt-nodejs");
const randomize = require('randomatic');


const jwtUtils = require('../utils/jwt.js');
const { sendMail } = require('./../utils/sendgrid');

const { encryptedString, decryptedString } = require('./../utils/cryptr');

const userTypes = ['SUPERADMIN', 'ADMINTEAM', 'USER'];

const UserSchema = new Schema({
    publicId: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true, lowercase: true },
    profilePic: { type: String, default: 'https://jksmap.herokuapp.com/img/agent-6.jpg' },
    name: { type: String, required: true },
    dateOfBirth: { type: String, default: '' },
    accountVerified: { type: Boolean, default: false },
    accountType: { type: String, required: true, default: 'USER', enum: userTypes },
    bio: { type: String, default: '' },
    mobile: {
        countryCode: { type: String, default: '+91' },
        number: { type: String },
    },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    socialAccounts: [{
        type: { type: String },
        data: {
            linkedOn: String,
            token: String
        }
    }],
    address: [{
        id: { type: String, required: true, unique: true },
        addressLine1: { type: String, default: '' },
        addressLine2: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        country: { type: String, default: '' },
        pin: { type: String, default: '' },
    }],
    currency: {
        symbol: { type: String, default: '$' },
        code: { type: String, default: 'USD' },
    },
    accountStatus: {
        isEmailVerified: { type: Boolean, default: false },
        isPhoneVerified: { type: Boolean, default: false },
        isAddressVerified: { type: Boolean, default: false }
    },
    setting: {
        searchable: { type: Boolean, default: false },
        showContactDetails: { type: Boolean, default: false },
    },
    // network: { //should be in diff model
    //     followers: [{ type: mongoose.Types.ObjectId }],
    //     followings: [{ type: mongoose.Types.ObjectId }]
    // },
    meta: {
        stars: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        likedBy: [{ type: mongoose.Types.ObjectId, ref: 'users' }], // should be in diff collection
        reviews: [
            {
                user: { type: mongoose.Types.ObjectId },
                review: { type: String, default: '' },
                star: { type: Number, required: true }
            }
        ]
    },
    userStatus: {
        isAdminBlocked: { type: Boolean, default: false },
        requestedForResetPassword: { type: Boolean, default: false },
        otp: { type: String, default: '' }
    },
    timezone: { type: String, default: '' },
    isOnline: { type: Boolean, default: false },
    lastLogin: { type: String, default: '' }
}, {
    timestamps: true
});

//Hash password before saving
UserSchema.pre("save", function (next) {
    var user = this;
    
    console.log(user.isModified("password"), '<<<< user.isModified("password")')
    //Hash password only if the password has been changed or is new
    if (!user.isModified("password")) return next();

    //Generate Salt
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) return next(err);
        console.log(hash, '<<<< hash"password")')

        //Change the password to the hash version
        user.password = hash;
        next();
    });
});


// UserSchema.pre("updateOne", function (next) {
//     var user = this;

//     //Hash password only if the password has been changed or is new
//     console.log(user,'<<<< user.isModified("password")')
//     if (!user.isModified("password")) return next();

//     //Generate Salt
// bcrypt.hash(user.password, null, null, function (err, hash) {
//     if (err) return next(err);
//     console.log(hash,'<<<< hash"password")')

//     //Change the password to the hash version
//     user.password = hash;
//     next();
// });
// });


UserSchema.method('matchPasswords', function (password) {
    try {
        return bcrypt.compareSync(password, this.password)
    }
    catch (err) {
        console.log(err);
        return false;
    }
})

// UserSchema.method('generateHash', function (password) {
//     try {
//         return bcrypt.hash(password)
//     }
//     catch (err) {
//         console.log(err);
//         return false;
//     }
// })

UserSchema.method('generateAuthToken', function () {
    return jwtUtils.signToken(_.pick(this, ["_id", "name", "email", "userName", "mobile.number", "accountType", "profilePic"]));
});


UserSchema.statics.generateHash = (userId,password) => {
    return new Promise((resolve, reject) => {
        try {
             bcrypt.hash(password, null, null,async function (err, hash) {
                if (err) return next(err);
                let user = await UserModel.updateOne({ _id:userId }, { $set: { password:hash } });
                resolve(true);
            });
        } catch (error) {
            reject(null);
        }
    });
};

UserSchema.statics.checkUserData = (email, phoneNumber, userName) => {
    return new Promise(async (resolve, reject) => {
        try {
            let emailExists = await UserModel.findOne({ email });
            // let phoneExists = await UserModel.findOne({ 'mobile.number': phoneNumber });
            let userNameExists = await UserModel.findOne({ userName });
            resolve({ emailExists: emailExists || false, phoneExists: false, userNameExists: userNameExists || false });
        } catch (error) {
            reject(error);
        }
    });
};

UserSchema.statics.forgotPassword = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            // otp
            const otp = await randomize('0', 6)
            let user = await UserModel.updateOne({ email, "userStatus.isAdminBlocked": false }, { $set: { "userStatus.requestedForResetPassword": true, "userStatus.otp": otp } });
            let objstring = JSON.stringify({ otp: otp, email: email });
            let encString = encryptedString(objstring);

            //send mail
            let mailStatus = await sendMail({
                user: {
                    email: email,
                    action: 'Reset Password',
                    actionUrl: (process.env.NODE_ENV === 'production' ? process.env.DOMAIN : process.env.DEV_DOMAIN) + '/reset-password/' + encString,
                },
                actionType: 'TRIGGER_RESET_MAIL'
            });

            // console.log('mailStatus > ',mailStatus)

            return resolve(user.nModified ? true : false);
        }
        catch (err) {
            return reject(err);

        }
    });
};




const UserModel = mongoose.model('user', UserSchema,'users');

module.exports = UserModel;