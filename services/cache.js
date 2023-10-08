const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 86400, checkperiod: 87400 });

exports.getItem = (key) => {
    return myCache.get(key);
  //   if (value != undefined) {
  //     return res.header("Content-Type", value["ContentType"]).send(value["Body"]);
  //   }
};

exports.setItem = (key, data) => {
    return myCache.set(key, data, 10000);
};
