const errorFunction = require('./../../../utils/apiErrorFunction');
const UserModel = require('./../../../models/users');
// const PropertyModel = require('./../../../models/property');


exports.querySearch = async (req, res, next) => {
    try {
        console.log(req.query,'<< query');
        // const userId = req.userId;
        const results =[]// await UserModel.find({ userName: { $regex: /pattern/<options>  }})
        // let response = {
        //     totalActiveProperties,       
        //     total: totalActiveProperties
        // };
        res.json({
            success:true,
            data:results//response
        });
    } catch (error) {
        errorFunction(res, error);
    }
}