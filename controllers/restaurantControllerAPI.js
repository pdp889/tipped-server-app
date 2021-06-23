let Pay = require('../models/pay');
let Restaurant = require('../models/restaurant');
const { body,validationResult } = require('express-validator');
let async =require('async');

exports.restaurant_list = function (req,res,next) {
    Restaurant.find()
    .then(list => res.json(list))
    .catch (err => res.json(err))
};

exports.restaurant_create_get = function (req,res,next){
    return res.json('restaurant_form', { title: 'Create Restaurant'});
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
            return res.json({title:'Create Restaurant', restaurant: restaurant, errors: errors.array() })
        } else{
            
            restaurant.save(function (err) {
                if (err) { return next(err); }
                
                return res.json({"status":"restaurant added"});
            });
        }
    }
]
