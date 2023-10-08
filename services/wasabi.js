const AWS = require("aws-sdk");
const wasabiConfig = require("./../config/wasabiConfig");

const multer = require('multer')
const multerS3 = require('multer-s3')

// const wasabiEndpoint = new AWS.Endpoint(wasabiConfig.wasabiEndPoint);
const buckets = [
    wasabiConfig.userBucket,
    wasabiConfig.propertyImageBucket,
    // wasabiConfig.videoBucket,
    // wasabiConfig.adminBucket,
    // wasabiConfig.audioBucket,
];
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 86400, checkperiod: 87400 });
// const S3S = require("s3-streams");

// const s3 = new AWS.S3({
//     endpoint: wasabiEndpoint,
//     accessKeyId: wasabiConfig.accessKeyId,
//     secretAccessKey: wasabiConfig.secretAccessKey,
// });

buckets.map((bucket) => {
    // s3.createBucket({ Bucket: bucket }, function (err, data) {
    //     if (!err) {
    //         console.log(bucket, " bucket created :", data); // successfull response
    //     } else {
    //         console.log("bucket : ", err, bucket); // an error occurred
    //     }
    // });
});

exports.saveItem = (file, bucket) => {
    return new Promise((resolve, reject) => {
        var params = {
            Bucket: bucket,
            Key: file.name,
            Body: file.data,
        };
        s3.upload(params, {}, function (err, data) {
            if (!err) {
                console.log("upload :", data); // successful response
                return resolve(data);
            } else {
                console.log("error : ", err); // an error occurred
                return reject(err)
            }
        });
    });
};

exports.getItem = (name, bucket, res) => {
    var params = {
        Bucket: bucket,
        Key: name
    };

    const value = myCache.get(params.Key);
    if (value != undefined) {
        return res.header("Content-Type", value['ContentType']).send(value['Body']);
    }

    s3.getObject(params, function (err, data) {
        if (!err) {
     
            res.header("Content-Type", data['ContentType']).send(data['Body']);
            let success = myCache.set(params.Key, data, 10000);
            console.log('Cached', params.Key, success);
        } else {
            console.log("error : ", err); // an error occurred
            return res.destroy();
        }
    });
};

exports.deleteItem = (name, bucket, res) => {
    var params = {
        Bucket: bucket,
        Key: name
    };
    s3.deleteObject(params,(err,data)=>{
        if(err)
            return res.send({success:false,data:{},message:'Something Went Wrong!'});
        const value = myCache.del(params.Key);
        console.log(data,err,value);
        res.send({success:true,data,message:'Delete Successfull!'});
    })
};

exports.multerS3Upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: wasabiConfig.propertyImageBucket,
      contentType:function(req,file,cb){
        cb(null, file.mimetype);
      },
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString()+file.originalname)
      }
    })
});

exports.multerS3ProfileImageUpload = multer({
    storage: multerS3({
      s3: s3,
      bucket: wasabiConfig.userBucket,
      contentType:function(req,file,cb){
        cb(null, file.mimetype);
      },
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString()+file.originalname)
      }
    })
});
  
  