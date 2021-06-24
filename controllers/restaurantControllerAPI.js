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

exports.restaurant_list = (req,res, next) => {
    Restaurant.find()
    .then(list => res.json(list))
    .catch (err => res.json(err))
};

exports.restaurant_create_get = (req,res, next) => {
    return res.json({ title: 'Create Restaurant'});
}

exports.restaurant_create_post =(req,res, next) => {
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