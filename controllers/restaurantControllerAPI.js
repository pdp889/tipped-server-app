let Pay = require('../models/pay');
let Restaurant = require('../models/restaurant');
const { body,validationResult } = require('express-validator');
let async =require('async');

exports.restaurant_list = function (req,res,next) {
    Restaurant.find()
    .then(list => res.json(list))
    .catch (err => res.json(err))
};

