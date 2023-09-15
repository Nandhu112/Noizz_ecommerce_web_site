const createError = require('http-errors');
const express = require('express');
const path = require('path');
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const session = require('express-session');
const nocache=require('nocache')  
const multer = require('multer');
const fileUpload=require('express-fileupload');
const exphbs=require('express-handlebars')

const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');

const twilio = require('twilio');

const app = express();

const hbs = exphbs.create({
	extname: '.hbs',
	defaultLayout: 'layout',
	layoutsDir: path.join(__dirname, 'views'),
	partialsDir: path.join(__dirname, 'views/partials'),
	// helpers: require('./helpers/handlebarHelpers'),
	runtimeOptions: { allowProtoPropertiesByDefault: true, allowedProtoMethodsByDefault: true },   
  helpers: {
    jsonStringify: function (context) {
      return JSON.stringify(context);    
    }   
  }
})


// view engine setup   
app.engine('hbs',hbs.engine)   
app.set('view engine', 'hbs');        

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(nocache())
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));          
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload())

app.use('/', userRouter);
app.use('/admin', adminRouter);

// Handle undefined routes (404)
app.use((req, res, next) => {
res.status(404).render('error-404'); 
});

  hbs.handlebars.registerHelper('notEqual', function (a, b) {    
	return a !== b;
  });
  hbs.handlebars.registerHelper('equal', function (a, b) {
	return a == b;
  }); 
  hbs.handlebars.registerHelper('formatDate', function (date) {
	const options = { weekday: "short", month: "long", day: "numeric", year: "numeric" };
	return new Date(date).toLocaleDateString("en-US", options);
  });
  hbs.handlebars.registerHelper('gt', function (a, b) {
	return a > b;
  }); 
  
  hbs.handlebars.registerHelper('lt', function (a, b) {
	return a < b;
  });
  hbs.handlebars.registerHelper('formatDate', function (date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  });
  hbs.handlebars.registerHelper('add', function (a, b) {
    return  parseInt(a) + parseInt(b);
  });   
  hbs.handlebars.registerHelper('sub', function (a, b) {
    return parseInt(a) - parseInt(b);
  });
 
app.listen(3001,()=>{
    console.log("server is running");       
})


