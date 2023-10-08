const axios = require('axios');
const cache = require("./../../../services/cache");
const errorFunction = require("../../../utils/apiErrorFunction");

exports.getProfileImageFromWasabi = async (req, res, next) => {
  try {
    let imageName = req.params.image;
    // await wasabiService.getItem(imageName, wasabiConfig.userBucket, res);
  } catch (error) {
    errorFunction(res, error);
  }
};

exports.getImageFromWasabi = async (req, res, next) => {
  try {
    let imageName = req.params.image;

    // await wasabiService.getItem(imageName, wasabiConfig.propertyImageBucket, res);
  } catch (error) {
    errorFunction(res, error);
  }
};

exports.postImage = async (req, res, next) => {
  let path = req.file.path.split("/");
  console.log(req.file, "Path");
  let url = req.file.path; 
  //  `${process.env.DOMAIN}api/v1/image/${path[path.length - 3]}/${
  //   path[path.length - 1]
  // }`;
  return res.json({
    success: true,
    data: { imageUrl: url },
  });
};

exports.getImage = async (req, res, next) => {
  const hash = req.params.hash;
  const imageName = req.params.image;
  const data = false//cache.getItem(hash + "/" + imageName);
  if (data)
    return res.header("Content-Type", data["ContentType"]).send(data["Body"]);
  else {
    // call from axios
    try {
      const cloudinaryImageUrl =
        "https://" +
        hash +
        "/profiles/" +
        imageName;
        const response = await axios.get(cloudinaryImageUrl);
        console.log(response.headers['content-type'],'RESPONSE',response);
        // res.header("Content-Type",response.headers['content-type'])
        // return res.send(response.data)
        let headers= response.headers;
      //  headers['Content-Type'] = response.headers['content-type'];
        res.writeHead(200, headers);
        res.end(response.data)
        // return res.set("content-type", response.headers['content-type']).send(response.data);
        // return res.send(response.data)

     
      // save to cache
    //   cache.setItem(hash + "/" + imageName, response);

      // send response
    //   return res.json({
    //     success: true,
    //     data: response.data,
    //   });
    } catch (error) {
      console.error(error);
    }
  }
};

exports.postImageToWasabi = async (req, res, next) => {
  try {
  

    console.log(req.files);
    req.files = req.files.map((file) => {
      file.imageUrl = `${process.env.DOMAIN}/im/${file.key}`;
      return file;
    });
    res.json({
      success: true,
      data: req.files,
    });
  } catch (error) {
    errorFunction(res, error);
  }
};

exports.deleteImageFromWasabi = async (req, res, next) => {
  try {
    let imageName = req.params.image;
    // await wasabiService.deleteItem(imageName, wasabiConfig.propertyImageBucket, res);
  } catch (error) {
    console.log(error);
    errorFunction(res, error);
  }
};
