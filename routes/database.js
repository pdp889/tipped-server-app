let express = require('express');
let router = express.Router();

let restaurant_controller = require('../controllers/restaurantController');
let pay_controller = require('../controllers/payController');

// Pay Routes //
router.get('/', pay_controller.index);
router.get('/pay/create', pay_controller.pay_create_get);
router.post('/pay/create', pay_controller.pay_create_post);
router.get('/pay/:id/delete', pay_controller.pay_delete_get);
router.post('/pay/:id/delete', pay_controller.pay_delete_post);
router.get('/pay/:id/update', pay_controller.pay_update_get);
router.post('/pay/:id/update', pay_controller.pay_update_post);
router.get('/pay/:id', pay_controller.pay_detail);
router.get('/pay', pay_controller.pay_list);

// Restaurant Routes //
router.get('/restaurant/create', restaurant_controller.restaurant_create_get);
router.post('/restaurant/create', restaurant_controller.restaurant_create_post);
router.get('/restaurant/:id/delete', restaurant_controller.restaurant_delete_get);
router.post('/restaurant/:id/delete', restaurant_controller.restaurant_delete_post);
router.get('/restaurant/:id/update', restaurant_controller.restaurant_update_get);
router.post('/restaurant/:id/update', restaurant_controller.restaurant_update_post);
router.get('/restaurant/:id', restaurant_controller.restaurant_detail);
router.get('/restaurant', restaurant_controller.restaurant_list);

module.exports = router;