let express = require('express');
let router = express.Router();

let restaurantAPI_controller = require('../controllers/restaurantControllerAPI');
let payAPI_controller = require('../controllers/payControllerAPI');
let userAPI_controller = require('../controllers/userControllerAPI')

// Pay Routes //
router.get('/createPay', payAPI_controller.pay_create_get);
router.post('/createPay', payAPI_controller.pay_create_post);
router.get('/getPayByZip/:zip', payAPI_controller.pay_by_zip);
router.get('/getAllPayByZip', payAPI_controller.all_pay_by_zip);
router.get('/getPayByEntree/:rating', payAPI_controller.pay_by_entree)
router.get('/getTopFiveZips', payAPI_controller.top_five_zips)
router.get('/getAllPayByEntree', payAPI_controller.all_pay_by_entree);
router.get('/getPayByZipAndEntree/:zip/:entree', payAPI_controller.pay_by_zip_and_entree);



// // Restaurant Routes //
router.get('/createRestaurant', restaurantAPI_controller.restaurant_create_get);
router.post('/createRestaurant', restaurantAPI_controller.restaurant_create_post);
router.get('/getRestaurants', restaurantAPI_controller.restaurant_list);

// User Routes //
router.post('/createNewUser', userAPI_controller.create_user_post);
router.get('/createNewUser', userAPI_controller.create_user_get);
router.post('/login', userAPI_controller.log_in_post);

module.exports = router;