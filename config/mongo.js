const mongoose = require('mongoose');

// connect
mongoose.connect(process.env.NODE_ENV === 'production' ? process.env.MONGO_ATLAS_URL: process.env.MONGO_ATLAS_URL ,{ useNewUrlParser:true,useUnifiedTopology: true });

mongoose.connection.on('connected', function () {
    console.log("Mongoose default connection is open "+process.env.MONGO_ATLAS_URL);
});

mongoose.connection.on('error', function (err) {
    console.log("Mongoose default connection has occured " + err + " error");
});

mongoose.connection.on('disconnected', function () {
    console.log("Mongoose default connection is disconnected");
});

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log("Mongoose default connection is disconnected due to application termination");
        process.exit(0);
    });
});