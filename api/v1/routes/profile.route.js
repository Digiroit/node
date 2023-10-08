const express = require('express');
const router = express.Router();

const profileController = require('./../controllers/profile.controller');
// const upload = require('./../../../services/wasabi').multerS3ProfileImageUpload;

router
    .route('/')
    .get(profileController.getProfile)
    .patch(profileController.patchProfile)
    .delete(profileController.deleteProfile);

// router
//     .route('/profileImage')
//     .post(upload.single('image'), profileController.postProfileImage);


module.exports = router;
