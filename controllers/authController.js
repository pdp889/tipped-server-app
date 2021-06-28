const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
let Pay = require('../models/pay');
let Restaurant = require('../models/restaurant');
let User = require('../models/user');
const { body,validationResult } = require('express-validator');
let async =require('async');
const passport = require('passport');
require('../passportLocal.js');
let bcrypt = require('bcryptjs');


exports.sign_up_get = function (req,res,next){
    res.render('sign_up');
}

exports.sign_up_post = async function (req, res, next) {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) { 
      return next(err);
    }
    const user = new User({
      username: req.body.username,
      password: hashedPassword
    }).save(err => {
      if (err) { 
        return next(err);
      }
      res.redirect("/");
    });
  });
  

}

exports.log_in_get = function (req,res,next){
  res.render('sign_in');
}