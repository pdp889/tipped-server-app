let express = require('express');
let router = express.Router();

let restaurantAPI_controller = require('../controllers/restaurantControllerAPI');
let payAPI_controller = require('../controllers/payControllerAPI');

// Pay Routes //

// router.post('/createPay', payAPI_controller.pay_create_post);
// router.post('/deletePay/:id', payAPI_controller.pay_delete_post);
// router.post('/updatePay/:id', payAPI_controller.pay_update_post);
router.get('/getPayByZip/:zip', payAPI_controller.pay_by_zip);
router.get('/getAllPayByZip', payAPI_controller.all_pay_by_zip);
router.get('/getPayByEntree/:rating', payAPI_controller.pay_by_entree)
router.get('/getTopFiveZips', payAPI_controller.top_five_zips)
router.get('/getAllPayByEntree', payAPI_controller.all_pay_by_entree);
router.get('/getPayByZipAndEntree/:zip/:entree', payAPI_controller.pay_by_zip_and_entree);



// // Restaurant Routes //
// router.post('/createRestaurant', restaurantAPI_controller.restaurant_create_post);
router.get('/getRestaurants', restaurantAPI_controller.restaurant_list);

module.exports = router;