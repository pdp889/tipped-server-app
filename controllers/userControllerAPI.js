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


function generateAccessToken(user){
    return jwt.sign({
        username: user.username,
        sub: user.id
    }, process.env.TOKEN_SECRET)
}

exports.create_user_get = function (req,res,next){
    return res.json({ title: 'Create User'});
}

exports.create_user_post = async function (req, res, next) {
    const { username, password } = req.body;
    let foundUser = await User.findOne({ username });
    if (foundUser) {
        return res.status(403).json({ error: 'username is already in use'});
    }
    
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if (err) {return next(err);}
        const newUser = new User({ username, hashedPassword})
        await newUser.save()
        const token = generateAccessToken(newUser)
        res.json({token})
      });
    

    

}

exports.log_in_post = async function (req, res, next) {
    const { username, password } = req.body;
    let foundUser = await User.findOne({ username });
    if (!foundUser) {
        return res.status(403).json({ error: 'username not in use'});
    } else {

        bcrypt.compare(password, foundUser.password, (err, res) => {
            if (res) {
              // passwords match! log user in
              const token = generateAccessToken(foundUser)
              res.json({token})
            } else {
              // passwords do not match!
              res.status(403).json({ error: 'password incorrect'})
            }
          })

    }
}