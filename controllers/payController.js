let Pay = require('../models/pay');
let Restaurant = require('../models/restaurant');
const { body,validationResult } = require('express-validator');
let async =require('async');

exports.index = function (req, res){
    async.parallel({
        pay_count: function(callback){
            Pay.countDocuments({}, callback);
        },
        restaurant_count: function(callback){
            Restaurant.countDocuments({}, callback);
        },
    }, function(err, results){
        res.render('index', {title: 'Database Home', error: err, data:results});
    });
}

exports.pay_list = function (req,res, next) {

    Pay.find()
    .populate('restaurant')
    .exec(function (err, list_pay) {
        if (err) {return next(err);}
        res.render('pay_list', {title: 'Pay List', pay_list: list_pay})
    });

};

exports.pay_detail = function (req,res, next) {
    async.parallel({
        pay: function(callback){
            Pay.findById(req.params.id)
            .exec(callback);
        }
    }, function(err, results){
        if (err) {return next(err);}
        if (results.pay ==null){
            let err = new Error('Pay not found');
            err.status = 404;
            return next(err);
        }
        res.render('pay_detail', {title: 'Pay Detail', pay: results.pay})
    });
};

exports.pay_create_get = function (req,res,next){
    async.parallel({
        restaurants: function(callback) {
            Restaurant.find(callback);
        },
    }, function(err, results) {
        if (err) {return next(err)};
        res.render('pay_form', {title: 'Create Pay Record', restaurants: results.restaurants})
    });
};

exports.pay_create_post = [

    body('hourly_pay', 'must be number').trim().isNumeric().escape(),
    body('weekly_tips', 'must be number').trim().isNumeric().escape(),
    body('weekly_hours', 'must be number').trim().isNumeric().escape(),
    body('restaurant').trim().isLength({min: 1}).escape(),
    body('user').trim().isLength({min: 1}).escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        let pay = new Pay({
            hourly_pay: req.body.hourly_pay,
            weekly_tips: req.body.weekly_tips,
            weekly_hours: req.body.weekly_hours,
            restaurant: req.body.restaurant,
            user: req.body.user,
        });
        if(!errors.isEmpty()){
            async.parallel({
                restaurants: function(callback) {
                    Restaurant.find(callback);
                },
            }, function(err, results) {
                if (err) {return next(err)};
                res.render('pay_form', {title: 'Create Pay Record', restaurants: results.restaurants, pay: pay, errors:errors.array() });
                return;
            });
        } else {
            pay.save(function(err){
                if (err) { return next(err); }
                res.redirect(pay.url);
            });
        }
    }
    

]

exports.pay_delete_get = function (req,res){
    async.parallel({
        pay: function(callback) {
            Pay.findById(req.params.id).exec(callback)
        }
    }, function (err, results){
        if (err) { return next(err); }
        if (results.pay==null) { // No results.
            res.redirect('/database/pay');
        }
        res.render('pay_delete', { title: 'Delete Pay', pay: results.pay})
    });
}

exports.pay_delete_post = function (req,res){
    async.parallel({
        pay: function(callback) {
            Pay.findById(req.params.id).exec(callback)
        }
    }, function (err, results){
        if (err) { return next(err); }
        Pay.findByIdAndRemove(req.body.payid, function deletePay(err){
            if (err) { return next(err); }
            res.redirect('/database/pay');
        })
    });
}

exports.pay_update_get = function (req,res, next){
    async.parallel({
        pay: function(callback) {
            Pay.findById(req.params.id).populate('restaurant').exec(callback);
        },
        restaurants: function(callback) {
            Restaurant.find(callback);
        },
        }, function(err, results) {
            if (err) {return next(err)};
            if (results.pay==null){
                let err = new Error('pay not found');
                err.status = 404;
                return next(err);
            }
        res.render('pay_form', {title: 'Update Pay', pay:results.pay, restaurants:results.restaurants})    
    });
}

exports.pay_update_post = [

    body('hourly_pay', 'must be number').trim().isNumeric().escape(),
    body('weekly_tips', 'must be number').trim().isNumeric().escape(),
    body('weekly_hours', 'must be number').trim().isNumeric().escape(),
    body('restaurant').trim().isLength({min: 1}).escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        let pay = new Pay({
            hourly_pay: req.body.hourly_pay,
            weekly_tips: req.body.weekly_tips,
            weekly_hours: req.body.weekly_hours,
            restaurant: req.body.restaurant,
            _id:req.params.id
        });

        if(!errors.isEmpty()){
            async.parallel({
                restaurants: function(callback) {
                    Restaurant.find(callback);
                },
            }, function(err, results) {
                if (err) {return next(err)};
                res.render('pay_form', {title: 'Update Pay Record', restaurants: results.restaurants, pay: pay, errors:errors.array() });
            });
            return;
        } else {
            Pay.findByIdAndUpdate(req.params.id, pay, {}, function(err,updatedPay) {
                if(err){return next(err);}
                res.redirect(updatedPay.url)
            });
        }
    }
]
