let Pay = require('../models/pay');
let Restaurant = require('../models/restaurant');
let User = require('../models/user')
const { body,validationResult } = require('express-validator');
let async =require('async');

exports.user_list = function (req,res,next) {
    
    User.find()
    .exec(function (err, list_user) {
        if (err) {return next(err);}
        res.render('user_list', {title: 'User List', user_list: list_user})
    });
};

exports.user_detail = function (req,res, next) {
    async.parallel({
        user: function(callback){
            User.findById(req.params.id)
            .exec(callback);
        },
        user_pays: function(callback) {
            Pay.find({ 'user': req.params.id }).exec(callback)
          },
    }, function(err, results){
        if (err) {return next(err);}
        if (results.user ==null){
            let err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        res.render('user_detail', {title: 'User Detail', user: results.user, user_pays: results.user_pays})
    });
};