let express = require('express');
let router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
let Pay = require('../models/pay');
let Restaurant = require('../models/restaurant');
let User = require('../models/user');
const { body,validationResult } = require('express-validator');
let async =require('async');
const passport = require('passport');
require('../passport.js');

let restaurantAPI_controller = require('../controllers/restaurantControllerAPI');
let payAPI_controller = require('../controllers/payControllerAPI');
let userAPI_controller = require('../controllers/userControllerAPI')

// Pay Routes //
router.get('/createPay', passport.authenticate('jwt',{session: false}), payAPI_controller.pay_create_get);
router.post('/createPay', passport.authenticate('jwt',{session: false}), payAPI_controller.pay_create_post);
router.get('/getPayByZip/:zip', passport.authenticate('jwt',{session: false}), payAPI_controller.pay_by_zip);
router.get('/getAllPayByZip', passport.authenticate('jwt',{session: false}), payAPI_controller.all_pay_by_zip);
router.get('/getPayByEntree/:rating', passport.authenticate('jwt',{session: false}), payAPI_controller.pay_by_entree)
router.get('/getTopFiveZips', passport.authenticate('jwt',{session: false}), payAPI_controller.top_five_zips)
router.get('/getAllPayByEntree', passport.authenticate('jwt',{session: false}), payAPI_controller.all_pay_by_entree);
router.get('/getPayByZipAndEntree/:zip/:entree', passport.authenticate('jwt',{session: false}), payAPI_controller.pay_by_zip_and_entree);



// // Restaurant Routes //
router.get('/createRestaurant', passport.authenticate('jwt',{session: false}), restaurantAPI_controller.restaurant_create_get);
router.post('/createRestaurant', passport.authenticate('jwt',{session: false}), restaurantAPI_controller.restaurant_create_post);
router.get('/getRestaurants', passport.authenticate('jwt',{session: false}), restaurantAPI_controller.restaurant_list);

// User Routes //
router.post('/createNewUser', userAPI_controller.create_user_post);
router.get('/createNewUser', userAPI_controller.create_user_get);
router.post('/login', userAPI_controller.log_in_post);

module.exports = router;