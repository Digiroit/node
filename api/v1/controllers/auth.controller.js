const errorFunction = require('./../../../utils/apiErrorFunction');

const _ = require("lodash");
const MESSAGES = require('./../../../config/messages');
const { TRIGGER_WELCOME_MAIL, TRIGGER_VERIFY_MAIL, TRIGGER_RESET_MAIL } = require('./../../../config/sendgridMails');
const UserModel = require('./../../../models/users');
const { sendMail } = require('./../../../utils/sendgrid');
const { v4: uuidv4 } = require('uuid');

exports.login = async (req, res, next) => {
    try {
        let { email, password } = req.body;
        let findObj = { $or: [ {email: email }, { userName: email } ] };
        let user = await UserModel.findOne(findObj);
        console.log(email, password, user)
        if (!user)
            throw {
                st: 200,
                msg: MESSAGES["LOGIN_ACCOUNT_NOT_FOUND"]
            };

        let result = await user.matchPasswords(password);
        console.log(result)
        if (result === false)
            throw {
                st: 200,
                msg: MESSAGES["LOGIN_INCORRECT_PASSWORD"]
            };
        const token = user.generateAuthToken();
        if (!user.accountStatus.isEmailVerified)
            return res
                .json({
                    status: 200,
                    success: true,
                    message: "Please verify your account. Check your inbox!",
                    verified: false
                });
        else
            return res
                .header("x-auth-token", token)
                .header("access-control-expose-headers", "x-auth-token")
                .json({
                    status: 200,
                    success: true,
                    verified: true,
                    message: "Login Successfull",
                    data: { ..._.pick(user, ["_id", "publicId", "setting","accountVerified","dateOfBirth", "name", "email", "mobile", "profilePic","userName"]), token },
                });
    } catch (error) {
        errorFunction(res, error);
    }
};

exports.signup = async (req, res, next) => {
    try {
        let {
            name,
            userName,
            email,
            // number,
            // countryCode,
            password
        } = req.body;
        setTimeout(() => {
            
        },5000)
        let { emailExists, userNameExists } = await UserModel.checkUserData(email, null, userName);
        let message; 
        if(emailExists)
            message ='Email already exists'
        else if(userNameExists)
            message ='Username already exists'

        if (emailExists || userNameExists) {
            return res.json({
                status: 200,
                success: false,
                message: message?message:''
            });
            // throw { st: 400, msg: message };
        }
        else {
            let newUser = await UserModel({
                publicId: uuidv4(),
                name,
                email,
                password,
                userName,
                // 'mobile.countryCode': countryCode,
                // 'mobile.number': number
            });

            newUser = await newUser.save();

            const token = newUser.generateAuthToken();

            res
                // .header("x-auth-token", token)
                // .header("access-control-expose-headers", "x-auth-token")
                .status(201).send({
                    status: 201,
                    success: true,
                    message: 'Signup Successfull',
                    data: { ..._.pick(newUser, ["_id", "publicId","setting", "accountVerified","dateOfBirth", "name", "email", "mobile", "profilePic","userName"]) },
                })

            //send mail in background
            try {
                await sendMail({
                    user: {
                        email: newUser.email,
                        action: 'Verify Now',
                        actionUrl: (process.env.NODE_ENV === 'production' ? process.env.DOMAIN : process.env.DEV_DOMAIN) + '/us-verify?t=' + token,
                    },
                    actionType: TRIGGER_WELCOME_MAIL
                });
                console.log('Sending Welcome mail...');
            } catch (error) {
                console.log(error,'Welcome Mail Failure');
            }
        }
    } catch (error) {
        console.log(error,'<<< error')
        errorFunction(res, error);
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        let { email } = req.body;
        const requestForResetPass = await UserModel.forgotPassword(email);
        return res.json({
            status: 200,
            message: requestForResetPass ? "Password reset mail sent successfull" : "Unable to request for reset password",
            data: {},
        });
    } catch (error) {
        errorFunction(res, error);
    }
}

exports.changePassword = async (req, res, next) => {
    //need auth token
    try {
        let userId = req.userId;
        let { oldPassword, newPassword } = req.body;
        const user = await UserModel.findOne({ _id: userId, 'userStatus.isAdminBlocked': false });
        let result = await user.matchPasswords(oldPassword);
        if (result === false)
            throw {
                st: 403,
                msg: MESSAGES["LOGIN_INCORRECT_PASSWORD"]
            };
        else {
            let updateStatus = await UserModel.updateOne({ _id: userId, 'userStatus.isAdminBlocked': false }, { password: newPassword });
            console.log('Status: ', updateStatus.nModified);
        }

        return res.json({
            status: 200,
            message: "Password Changed Successfully",
            data: {},
        });
    } catch (error) {
        errorFunction(res, error);
    }
}

exports.checkUsername = async (req, res, next) => {
    try {
        let { username } = req.params;
        let user = await UserModel.findOne({ userName: username?username.toLowerCase():'' });
        
        return res
            .json({
                status: 200,
                success: true,
                message:user ?MESSAGES["USERNAME_ALREADY_EXISTS"] : MESSAGES["USERNAME_AVAILABLE"],
                data:{
                    isUsernameExists:!!user
                }
            });

    } catch (error) {
        errorFunction(res, error);
    }
};