const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const subdomain = require('express-subdomain');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiRouter = require('./api/v1/index');
// const imageRouter = require('./api/v1/routes/image.route');

const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();
const corsOption = {origin:['http://localhost:3000/']};

//Swagger setup
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Backend',
    version: '1.0.0',
    description: 'API for social media app.',
  },
  servers: [{
    url: 'http://localhost:9000',
    description: 'Local server',
  }
  ],
  security: [{ bearerAuth: [""] }]
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./api/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

app.use(cors());
// app.use(cors({
//   origin: ['https://app.greybox.space','https://www.app.greybox.space','http://localhost:3000','http://app.greybox.localhost:9000','api.mapbox.com','*'],
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//   'Access-Control-Allow-Header': 'Origin, X-Requested-With, Content-Type, Accept',
//   credentials: true
// }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(subdomain('app',express.static(path.join(__dirname, 'build'))));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(subdomain('api', apiRouter));

// APIs for Frontend
app.use('/api/v1', apiRouter);

app.use('/users', usersRouter);
app.use('/', indexRouter);




// fetch images here ---- 
// 1. https://greybox.space/im/<filename> - property image
// 2. https://greybox.space/im/profile/<filename> - user profile image
// app.use('/im', imageRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//feed data 
// require('./coldStartData/feedCategories');

module.exports = app;
