let Pay = require('../models/pay');
let Restaurant = require('../models/restaurant');
const { body,validationResult } = require('express-validator');
let async =require('async');

exports.pay_list = async function (req,res, next) {

    let list_pay = await Pay.find().populate('restaurant');
    res.render('pay_list', {title: 'Pay List', pay_list: list_pay})
};

exports.pay_detail = async function (req,res, next) {
    let pay = await Pay.findById(req.params.id);
    if (pay ==null){
        let err = new Error('Pay not found');
        err.status = 404;
        return next(err);
    }
    res.render('pay_detail', {title: 'Pay Detail', pay: pay});
};

exports.pay_create_get = async function (req,res,next){
    let restaurants = await  Restaurant.find();
    res.render('pay_form', {title: 'Create Pay Record', restaurants: restaurants})
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

exports.pay_delete_get = async function (req,res){
    let pay = await Pay.findById(req.params.id);
    if (pay==null) { 
        res.redirect('/database/pay');
    }
    res.render('pay_delete', { title: 'Delete Pay', pay: pay})

}

exports.pay_delete_post = async function (req,res){
    let pay = await Pay.findById(req.params.id);
    if (!pay) {
        return err;
    }
    Pay.findByIdAndRemove(req.body.payid, function deletePay(err){
        if (err) { return next(err); }
        res.redirect('/database/pay');
    })
}

exports.pay_update_get = async function (req,res, next){
    let [pay, restaurants] = await Promise.all([Pay.findById(req.params.id).populate('restaurant'), Restaurant.find()]);
    if (pay == null){
        let err = new Error('pay not found');
        err.status = 404;
        return next(err);
    }
    res.render('pay_form', {title: 'Update Pay', pay: pay, restaurants: restaurants})  

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
