let Pay = require('../models/pay');
let Restaurant = require('../models/restaurant');
let User = require('../models/user')
const { body,validationResult } = require('express-validator');
let async =require('async');

exports.user_list = async function (req,res,next) {
    const listUser = await User.find();
    res.render('user_list', {title: 'User List', user_list: listUser})
};

exports.user_detail = async function (req,res, next) {
    
    let [user, userPays] = await Promise.all([User.findById(req.params.id), Pay.find({ 'user': req.params.id })])
    if (user == null){
        let err = new Error('User not found');
        err.status = 404;
        return next(err);
    }
    res.render('user_detail', {title: 'User Detail', user: user, user_pays: userPays})
};