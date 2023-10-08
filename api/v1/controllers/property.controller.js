const errorFunction = require('./../../../utils/apiErrorFunction');

const _ = require("lodash");
const MESSAGES = require('./../../../config/messages');
const { TRIGGER_WELCOME_MAIL, TRIGGER_VERIFY_MAIL, TRIGGER_RESET_MAIL } = require('./../../../config/sendgridMails');
const PropertyModel = require('./../../../models/property');
const CategoryModel = require('./../../../models/category');
const TrashModel = require('./../../../models/trash');
const { sendMail } = require('./../../../utils/sendgrid');
const { v4: uuidv4 } = require('uuid');
const { propertyOf } = require('lodash');

exports.getMyProperties = async (req, res, next) => {
    try {
        const userId = req.userId;
        const projects = await PropertyModel.find({ postedBy: userId }).populate('propertyCategory');
        res.json({
            success: true,
            data: projects
        });

    } catch (error) {
        errorFunction(res, error);
    }
}


exports.getProperty = async (req, res, next) => {
    try {
        let propertyPublicId = req.params.propertyPublicId;
        let { pageNumber, nPerPage } = req.query;
        pageNumber = pageNumber || 1;
        nPerPage = nPerPage || 20;
        if (!propertyPublicId) {
            let projects = await PropertyModel.find({ postStatus: { isAdminBlocked: false, isSearchable: true, isAdminVerified: true } }).sort({ createdAt: -1 }).skip((pageNumber - 1) * nPerPage).limit(nPerPage);
            res.json({
                success: true,
                data: projects
            });
        } else {
            let project = await PropertyModel.findOne({ publicId: propertyPublicId, postStatus: { isAdminBlocked: false, isSearchable: true, isAdminVerified: true } });
            res.json({
                success: true,
                data: [project]
            });
        }
    } catch (error) {
        errorFunction(res, error);
    }
};

exports.postProperty = async (req, res, next) => {
    try {
        let property = req.body;
        let userId = req.userId;
        console.log('====================================');
        console.log(userId);
        console.log('====================================');
        // find currency symbol
        // property.cost.currency = '₹';
        // property.cost.currencyCode = 'INR';

        let newProperty = await PropertyModel({
            publicId: uuidv4(),
            title:property.title,
            address: {
                addressLine1: property.address.addressLine1,
                addressLine2: property.address.addressLine2,
                city: property.address.city,
                state: property.address.state,
                country: property.address.country,
                pin: property.address.pin
            },
            images: property.images, //['https://wallpapercave.com/wp/wp2464201.jpg', 'https://wallpapercave.com/wp/wp2464201.jpg'],
            cost: {
                currency: property.cost.currency,
                currencyCode: property.cost.currencyCode,
                value: property.cost.value
            },
            propertyCategory: property.propertyCategory,
            status: property.status,
            area: {
                unit: property.area.unit,//'meter-square',
                symbol: property.area.symbol,
                value: property.area.value
            },
            quickSummary: {
                front: property.quickSummary && property.quickSummary.front,
                depth: property.quickSummary && property.quickSummary.depth,
                beds: property.quickSummary && property.quickSummary.beds,
                baths: property.quickSummary && property.quickSummary.baths,
                garage: property.quickSummary && property.quickSummary.garage,
                facing: property.quickSummary && property.quickSummary.facing
            },
            amenities: property.amenities,// ['Balcony', 'Near School', 'Outdoor Kitchen', 'Cabel Tv'],
            videoURL: property.videoURL,
            floorPlan: property.floorPlan,// 'https://i.pinimg.com/originals/20/44/04/204404d5c0471ea9400e81905d02276e.png',
            location: {
                lat: property.location.lat,
                lng: property.location.lng
            },
            postedByRole: 'AGENT',
            postedBy: userId
        });

        newProperty = await newProperty.save();

        res.json({
            success: true,
            data: newProperty
        });

    } catch (error) {
        errorFunction(res, error);
    }
};

exports.patchProperty = async (req, res, next) => {
    try {
        let updatedProperty = { ...req.body };

        let propertyPublicId = req.params.propertyPublicId;

        let property = await PropertyModel.findOneAndUpdate(
            { publicId: propertyPublicId },
            updatedProperty,
            { new: true }
        );

        res.json({
            success: false,
            data: property
        });

    } catch (error) {
        errorFunction(res, error);
    }
};

exports.deleteProperty = async (req, res, next) => {
    try {
        let userId = req.userId;

        let propertyPublicId = req.params.propertyPublicId;

        let property = await PropertyModel.findOne({ publicId: propertyPublicId, postedBy: userId });

        console.log('property>>', property, userId);

        let deletedProperty = await TrashModel({
            userId: userId,
            type: 'PROPERTY',
            object: property
        });

        deletedProperty = await deletedProperty.save();

        let deleteStatus = await PropertyModel.deleteOne({ publicId: propertyPublicId, publicId: propertyPublicId, postedBy: userId });
        console.log('Delete Status >', deleteStatus);
        res.json({
            success: true,
            data: { publicId: property.publicId },
            message: 'Property Removed Successfully'
        });

    } catch (error) {
        errorFunction(res, error);
    }
};

exports.getCategories = async (req, res, next) => {
    try {

        let categories = await CategoryModel.find({});
        console.log(categories);
        res.json({
            success: true,
            data: categories,
            message: 'Categories Found'
        });

    } catch (error) {
        errorFunction(res, error);
    }
};
