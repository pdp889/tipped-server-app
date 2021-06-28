let Pay = require('../models/pay');
let Restaurant = require('../models/restaurant');
const { body,validationResult } = require('express-validator');
let async =require('async');

exports.restaurant_list = async function (req,res,next) {
    
    let list = await Restaurant.find();
    res.render('restaurant_list', {title: 'Restaurant List', restaurant_list: list})

};

exports.restaurant_detail = async function (req,res, next) {
    let [restaurant, restaurant_pays] = await Promise.all([Restaurant.findById(req.params.id), Pay.find({ 'restaurant': req.params.id })])
    if (restaurant ==null){
        let err = new Error('Restaurant not found');
        err.status = 404;
        return next(err);
    }
    res.render('restaurant_detail', {title: 'Restaurant Detail', restaurant: restaurant, restaurant_pays: restaurant_pays})

};

exports.restaurant_create_get = function (req,res,next){
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
    
    res.render('restaurant_form', { title: 'Create Restaurant', zips: zips.sort(function(a, b) {return (a < b) ? -1 : (a > b) ? 1 : 0;})});
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
            res.render('restaurant_form', {title:'Create Restaurant', restaurant: restaurant, errors: errors.array() })
            return;
        } else{
            
            restaurant.save(function (err) {
                if (err) { return next(err); }
                
                res.redirect(restaurant.url);
            });
        }
    }
]

exports.restaurant_delete_get = async function (req,res,next){
    let [restaurant, restaurant_pays] = await Promise.all([Restaurant.findById(req.params.id), Pay.find({ 'restaurant': req.params.id })]);
    if (restaurant ==null){
        res.redirect('/database/restaurant');
    }
    res.render('restaurant_delete', { title: 'Delete Restaurant', restaurant: restaurant, restaurant_pays: restaurant_pays } );

}

exports.restaurant_delete_post = async function (req,res,next){
    let [restaurant, restaurant_pays] = await Promise.all([Restaurant.findById(req.params.id), Pay.find({ 'restaurant': req.params.id })]);
    if (restaurant_pays.length > 0){
        res.render('restaurant_delete', { title: 'Delete Restaurant', restaurant: restaurant, restaurant_pays: restaurant_pays } );
        return;
    } else {
        Restaurant.findByIdAndRemove(req.body.restaurantid, function deleteRestaurant(err) {{
            if (err) { return next(err); }
            res.redirect('/database/restaurant')
        }})
    }
}

exports.restaurant_update_get = async function (req,res,next){
    let restaurant = await Restaurant.findById(req.params.id);
    if (restaurant==null) { 
        let err = new Error('Restaurant not found');
        err.status = 404;
        return next(err);
    }
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
    res.render('restaurant_form', {
        title: 'Update Restaurant', 
        restaurant: restaurant, 
        zips: zips.sort(function(a, b) {return (a < b) ? -1 : (a > b) ? 1 : 0;}),
    });

};

exports.restaurant_update_post = [
    body('zip_code').trim().isLength({min:5, max:5}).escape().withMessage('Zip code must have exactly 5 characters'),
    body('name').trim().isLength({min:1}).escape().withMessage('Name must be specified'),
    body('entree_price').isNumeric().trim().escape().withMessage('Must be a number'),

    (req,res,next) => {
        const errors = validationResult(req);

        let restaurant = new Restaurant({
            zip_code: req.body.zip_code,
            name: req.body.name,
            entree_price: req.body.entree_price,
            _id:req.params.id 
        });

        if(!errors.isEmpty()){
            res.render('restaurant_form', {title:'Update Restaurant', restaurant: restaurant, errors: errors.array() })
            return;
        } else {
           Restaurant.findByIdAndUpdate(req.params.id, restaurant, {}, function(err, updatedRestaurant){
            if (err) { return next(err); }
            res.redirect(updatedRestaurant.url);
           });
        }
    }

]