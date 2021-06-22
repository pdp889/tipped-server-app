let Pay = require('../models/pay');
let Restaurant = require('../models/restaurant');
const { body,validationResult } = require('express-validator');
let async =require('async');

exports.restaurant_list = function (req,res,next) {
    
    Restaurant.find()
    .exec(function (err, list_restaurant) {
        if (err) {return next(err);}
        res.render('restaurant_list', {title: 'Restaurant List', restaurant_list: list_restaurant})
    });
};

exports.restaurant_detail = function (req,res, next) {
    async.parallel({
        restaurant: function(callback){
            Restaurant.findById(req.params.id)
            .exec(callback);
        }
    }, function(err, results){
        if (err) {return next(err);}
        if (results.restaurant ==null){
            let err = new Error('Restaurant not found');
            err.status = 404;
            return next(err);
        }
        res.render('restaurant_detail', {title: 'Restaurant Detail', restaurant: results.restaurant})
    });
};

exports.restaurant_create_get = function (req,res,next){
    res.render('restaurant_form', { title: 'Create Restaurant'});
}

exports.restaurant_create_post = [
    body('zip_code').trim().isLength({min:5, max:5}).escape().withMessage('Zip code must have exactly 5 characters'),
    body('name').trim().isLength({min:1}).escape().withMessage('Name must be specified'),
    body('entree_price').isNumeric().trim().escape().withMessage('Must be a number'),

    (req,res,next) => {
        const errors = validationResult(req);

        let restaurant = new Restaurant({
            zip_code: req.body.zip_code,
            name: req.body.name,
            entree_price: req.body.entree_price 
        });

        if(!errors.isEmpty()){
            res.render('restaurant_form', {title:'Create Restaurant', restaurant: restaurant, errors: errors.array() })
            return;
        } else{
            
            restaurant.save(function (err) {
                if (err) { return next(err); }
                
                res.redirect(restaurant.url);
            });
        }
    }
]

exports.restaurant_delete_get = function (req,res,next){
    async.parallel({
        restaurant: function(callback) {
            Restaurant.findById(req.params.id).exec(callback)
        },
        restaurant_pays: function(callback) {
          Pay.find({ 'restaurant': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.restaurant==null) { // No results.
            res.redirect('/database/restaurant');
        }
        // Successful, so render.
        res.render('restaurant_delete', { title: 'Delete Restaurant', restaurant: results.restaurant, restaurant_pays: results.restaurant_pays } );
    });
}

exports.restaurant_delete_post = function (req,res,next){
    async.parallel({
        restaurant: function(callback) {
            Restaurant.findById(req.params.id).exec(callback)
        },
        restaurant_pays: function(callback) {
          Pay.find({ 'restaurant': req.params.id }).exec(callback)
        },
    }, function (err, results){
        if (err) { return next(err); }
        if (results.restaurant_pays.length > 0){
            res.render('restaurant_delete', { title: 'Delete Restaurant', restaurant: results.restaurant, restaurant_pays: results.restaurant_pays } );
            return;
        } else {
            Restaurant.findByIdAndRemove(req.body.restaurantid, function deleteRestaurant(err) {{
                if (err) { return next(err); }
                // Success - go to author list
                res.redirect('/database/restaurant')
            }})
        }
    });
}

exports.restaurant_update_get = function (req,res,next){
    async.parallel({
        restaurant: function (callback) {
            Restaurant.findById(req.params.id).exec(callback)
        },
    }, function (err, results){
        if (err) { return next(err); }
        if (results.restaurant==null) { // No results.
            var err = new Error('Restaurant not found');
            err.status = 404;
            return next(err);
        }

        res.render('restaurant_form', {title: 'Update Restaurant', restaurant: results.restaurant });

    });

};

exports.restaurant_update_post = [
    body('zip_code').trim().isLength({min:5, max:5}).escape().withMessage('Zip code must have exactly 5 characters'),
    body('name').trim().isLength({min:1}).escape().withMessage('Name must be specified'),
    body('entree_price').isNumeric().trim().escape().withMessage('Must be a number'),

    (req,res,next) => {
        const errors = validationResult(req);

        let restaurant = new Restaurant({
            zip_code: req.body.zip_code,
            name: req.body.name,
            entree_price: req.body.entree_price,
            _id:req.params.id 
        });

        if(!errors.isEmpty()){
            res.render('restaurant_form', {title:'Update Restaurant', restaurant: restaurant, errors: errors.array() })
            return;
        } else {
           Restaurant.findByIdAndUpdate(req.params.id, restaurant, {}, function(err, updatedRestaurant){
            if (err) { return next(err); }
            res.redirect(updatedRestaurant.url);
           });
        }
    }

]