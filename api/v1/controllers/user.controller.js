const errorFunction = require('./../../../utils/apiErrorFunction');
const UserModel = require('./../../../models/users');
const MESSAGES = require('./../../../config/messages');


exports.getUserData = async (req, res, next) => {
    try {
        let userId = req.params.userPublicId;
        if (!userId)
            throw { st: 400, msg: 'Invalid userId' }
        //get user data from token user id
        let user = await UserModel.findOne({ publicId: userId, "userStatus.isAdminBlocked": false });
        return res.json({
            success: true,
            data: user
        });
    } catch (error) {
        errorFunction(res, error);
    }
};

exports.searchUsers = async (req, res, next) => {
    try {
        let userId = req.params.userPublicId;
        if (!userId)
            throw { st: 400, msg: 'Invalid userId' }
        let searchKeyword = req.query.searchKeyword;
        searchKeyword = searchKeyword ? searchKeyword.trim() : '';
        //search users by username
        let user = await UserModel.find({ userName: { $regex: '/' + searchKeyword + '/', $options: 'g' } });
        return res.json({
            success: true,
            data: user
        });
    } catch (error) {
        errorFunction(res, error);
    }
};

exports.checkUserName = async (req, res, next) => {
    try {
        let userName = req.query.userName;
        userName = userName ? userName.trim() : '';
        //search users by username
        let user = await UserModel.find({ userName: userName });
        return res.json({
            success: true,
            data: user
        });
    } catch (error) {
        errorFunction(res, error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        let userId = req.userId;
        let userData = req.body;
        console.log('userData', userData);
        delete userData?._id;
        delete userData?.userStatus?.isAdminBlocked;
        delete userData?.password;
        if (!userId)
            throw { st: 400, msg: 'Invalid userId' };
        //get user data from token user id
        let updateResult = await UserModel.updateOne({ _id: userId }, { $set: { ...userData } });
        let user = await UserModel.findOne({ _id: userId, "userStatus.isAdminBlocked": false });
        const token = user.generateAuthToken();
        delete user?._doc?.password;
        return res.json({
            success: true,
            data: { ...user?._doc, token }
        });
    } catch (error) {
        errorFunction(res, error);
    }
};

exports.updatePassword = async (req, res, next) => {
    try {
        let userId = req.userId;

        let passwords = req.body;

        if (!userId)
            throw { st: 400, msg: 'Invalid userId' };

        let existingUser = await UserModel.findOne({ _id: userId });
        
        let result = await existingUser.matchPasswords(passwords.password);

        if (!existingUser || result === false || passwords.newPassword !== passwords.confirmNewPassword)
            throw {
                st: 200,
                msg: MESSAGES["LOGIN_INCORRECT_PASSWORD"]
            };


        //get user data from token user id
        const updatedPassword = await UserModel.generateHash(userId,passwords.newPassword);
        if(!updatedPassword){
            throw {
                st: 200,
                msg: 'Password Not Updated'
            }; 
        }
        let user = await UserModel.findOne({ _id: userId, "userStatus.isAdminBlocked": false });
        const token = user.generateAuthToken();
        delete user?._doc?.password;
        return res.json({
            success: true,
            data: { ...user?._doc, token }
        });
    } catch (error) {
        console.log(error,'rerer')
        errorFunction(res, error);
    }
};
