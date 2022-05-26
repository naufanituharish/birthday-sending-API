const express       = require('express');
// const path          = require('path');
// const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const bodyParser 	  = require('body-parser');
// const passport      = require('passport');
const pe            = require('parse-error');
const cors          = require('cors');
const schedule      = require('node-schedule');


const v1    = require('./routes/v1');
const app   = express();

const CONFIG  = require('./config/config');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// to use passport
// Passport Initialize
// app.use(passport.initialize());

// Env Logging
console.log("Environment:", CONFIG.app)

// Check Database Connection and Initialize Database 
const models = require("./models");
const greetingService = require('./services/greeting.service');
const scheduleService = require('./services/schedule.service');

models.sequelize.authenticate().then(() => {
    console.log('Connected to SQL database:', CONFIG.db_name);
})
.catch(err => {
    console.error('Unable to connect to SQL database:',CONFIG.db_name, err);
});
if(CONFIG.app==='dev'){
    // creates table if they do not already exist
    models.sequelize.sync();

    // deletes all tables then recreates them
    // models.sequelize.sync({ force: true });

    // seed greeting
    greetingService.seedGreeting({text:'it’s your birthday'});
}


// Initialize CORS
app.use(cors());

// Run Schedule every hour
schedule.scheduleJob('48 * * * *', async ()=> {
  console.log('running hourly');
  scheduleService.checkingSchedule();
});

// Initialize Routers
app.use('/v1', v1);

app.get('/', function(req, res){
	res.statusCode = 200;//send the appropriate status code
	res.json({status:"success", message:"Birthday Greeting API"})
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// Handle all uncaught promise rejections
process.on('unhandledRejection', error => {
    console.error('Uncaught Error', pe(error));
});
