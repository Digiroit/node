const errorFunction = require('./../../../utils/apiErrorFunction');
const UserModel = require('./../../../models/users');
// const PropertyModel = require('./../../../models/property');


exports.stats = async (req, res, next) => {
    try {
        // const userId = req.userId;
        // const totalActiveProperties = await PropertyModel.countDocuments({postedBy:userId,'projectSetting.isAdminBlocked':false,})

        // let response = {
        //     totalActiveProperties,       
        //     total: totalActiveProperties
        // };

        res.json({
            success: true,
            data: response
        });
    } catch (error) {
        errorFunction(res, error);
    }
}


exports.searchQuery = async (req, res, next) => {
    try {
        console.log(req.query, '<<< Query');
        // const userId = req.userId;
        // const totalActiveProperties = await PropertyModel.countDocuments({postedBy:userId,'projectSetting.isAdminBlocked':false,})
        const results = await UserModel.find({ userName: { $regex: req.query.search, $options: 'gim' }}, { userName: 1, name: 1, profilePic: 1 } )
    // let response = {
    //     total: totalActiveProperties
    // };
        res.json({
            success: true,
            data: results
        });
} catch (error) {
    errorFunction(res, error);
}
}