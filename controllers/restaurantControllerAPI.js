const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
let Pay = require('../models/pay');
let Restaurant = require('../models/restaurant');
let User = require('../models/user');
const { body,validationResult } = require('express-validator');
let async =require('async');
const passport = require('passport');
require('../passportAPI.js');

exports.restaurant_list = (req,res, next) => {
    Restaurant.find()
    .then(list => res.json(list))
    .catch (err => res.json(err))
};

exports.restaurant_create_get = (req,res, next) => {
    let zips = ['68007','68010','68022','68102','68104','68105',
    '68106','68107','68108','68110','68111','68112',
    '68114','68116','68117','68118','68122','68124',
    '68127','68130','68131','68132','68134','68135',
    '68137','68142','68144','68152','68154','68164',
    '68178','68064','68069','68005','68123','68147',
    '68157','68138','68028','68128','68113','68136',
    '68133','68046','68059','51521','51525','51510',
    '51501','51503','51526','51536','51542','51549',
    '51548','51553','51559','51560','51575','51576',
    '51577']
    return res.json({ title: 'Create Restaurant', zips:zips});
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