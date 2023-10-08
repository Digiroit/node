const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const multer = require('multer');
const imageController = require('../controllers/image.controller');
const upload = multer({dest: 'public/profiles/'}) 
const authMiddleware = require('./../middlewares/auth.middleware');
cloudinary.config({ 
    cloud_name: '', 
    api_key: '', 
    api_secret: '' 
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'profiles',
      filename:  (req, file) => {
        return file.originalname.toLowerCase().split(' ').join('-');
      },
    //   format: async (req, file) => 'png', // supports promises as well
      public_id: (req, file) => {
        return Date.now().toString();
      },
      fileFilter: (req, file) =>{    
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            return true;
        } else {
            console.log('===============================================INVALID Image')
            return false ;//new Error('Only .png, .jpg and .jpeg format allowed!');
      }}
    },
});
   
const parser = multer({ storage: storage });

// router
//     .route('/profile/:image')
//     .get(imageController.getProfileImageFromWasabi)

router
    .route('/')
    .post(authMiddleware.authMiddleware,parser.single('image'),imageController.postImage);

router
    .route('/:hash/:image')
    .get(imageController.getImage)
    .delete(authMiddleware.authMiddleware,imageController.deleteImageFromWasabi);


module.exports = router;
