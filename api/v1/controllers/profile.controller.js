const errorFunction = require('./../../../utils/apiErrorFunction');
const UserModel = require('./../../../models/users');

exports.getProfile = async (req, res, next) => {
    try {
        let userId = req.userId;
        if (!userId)
            throw { st: 400, msg: 'Invalid userId' }
        //get user data from token user id
        let user = await UserModel.findOne({ _id: userId, "userStatus.isAdminBlocked": false });
        return res.json({
            success: true,
            data: user
        });
    } catch (error) {
        errorFunction(res, error);
    }
};

exports.patchProfile = async (req, res, next) => {
    try {

        let updatedUser = { ...req.body };
        let userId = req.userId;

        //prevent userStatus to being overridden 
        delete updatedUser.userStatus;
        delete updatedUser.password;

        let user = await UserModel.findOneAndUpdate(
            { _id: userId },
            updatedUser,
            { new: true }
        );

        return res.json({
            success: true,
            data: user
        });
    } catch (error) {
        errorFunction(res, error);
    }
};

exports.deleteProfile = async (req, res, next) => {
    try {
        let userId = req.userId;

        //find user
        let user = await UserModel.findOne({ _id: userId, "userStatus.isAdminBlocked": false });

        let deletedUser = await TrashModel({
            userId: userId,
            type: 'USER',
            object: user
        });

        deletedUser = await deletedUser.save();

        let deleteStatus = await UserModel.deleteOne({ _id: userId, "userStatus.isAdminBlocked": false });

        res.json({
            success: true,
            data: { userId: user.publicId },
            message: 'User Removed Successfully'
        });

    } catch (error) {
        errorFunction(res, error);
    }
};

exports.postProfileImage = async (req, res, next) => {
    try {
        let uploadedFile = req.file;
        let userId = req.userId;

        // update user profile
        let user = await UserModel.findOneAndUpdate(
            { _id: userId },
            { profilePic: uploadedFile.key },
            { new: true }
        );

        return res.json({
            success: true,
            data: user
        });
    } catch (error) {
        errorFunction(res, error);
    }
};

