const express 			    = require('express');
const router 			      = express.Router();

// const passport      	  = require('passport');

/* Controller List */
const UserController 	  = require('../controllers/user.controller');
const LocationController 	  = require('../controllers/location.controller');
const GreetingController 	  = require('../controllers/greeting.controller');

/* GET Check the api work. */
router.get('/', function(req, res, next) {
  res.statusCode = 200;
  res.json({status:"success", message:"Birthday Greeting API", data:{"version_number":"v1.0.0"}})
});

router.post('/user', UserController.create);    // C
router.get('/user', UserController.get);        // R
router.put('/user', UserController.update);     // U
router.delete('/user', UserController.remove);  // D

// user list route
router.get('/users', UserController.list);       // R

// update greeting
router.put('/greeting', GreetingController.update);     // U

// location list route
router.get(  '/locations', LocationController.list); // R

module.exports = router;