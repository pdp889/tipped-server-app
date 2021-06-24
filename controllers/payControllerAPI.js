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

exports.pay_by_zip = (req,res, next) => {
    
    Restaurant.aggregate([{
        $lookup:
            {
              from: "pays",
              localField: "_id",
              foreignField: "restaurant",
              as: "paystubs"
            }
       }
    ]).then(aggregate => {
        let payArray = Array.from(aggregate);
        let payStubArray = [];
        let runningTotal = 0;
        let stubCount = 0;
        payArray.forEach(item => {
            
            
            if (item["zip_code"] == req.params.zip){
                
                let weeklyHours = 0;
                let weeklyComp = 0;

                let stubs = Array.from(item["paystubs"]);

                stubs.forEach(stub => {
                    weeklyHours += stub["weekly_hours"];
                    weeklyComp += ((stub["weekly_hours"] * stub["hourly_pay"]) + stub["weekly_tips"])
                })

                let object = {
                    "restaurant name": item["name"],
                    "average hourly": weeklyComp/weeklyHours
                }
                
                payStubArray.push(object);    
            }
            
        })
        payStubArray.forEach(item => {
            runningTotal += item["average hourly"];
            stubCount += 1;
        })
        let object = {
            "zip_code" : req.params.zip,
            "running_total": runningTotal,
            "stub_count": stubCount,
            "average": Math.round(100*(runningTotal/stubCount))/100
        }
        return res.json(object);
    })
    .catch (err => res.json(err))
}

exports.all_pay_by_zip = (req,res, next) => {
    
    Restaurant.aggregate([{
        $lookup:
            {
              from: "pays",
              localField: "_id",
              foreignField: "restaurant",
              as: "paystubs"
            }
       }
    ]).then(aggregate => {
        let payArray = Array.from(aggregate);

        let payStubArray = [];
        
        
        payArray.forEach(item => {
                
                let weeklyHours = 0;
                let weeklyComp = 0;

                let stubs = Array.from(item["paystubs"]);

                stubs.forEach(stub => {
                    weeklyHours += stub["weekly_hours"];
                    weeklyComp += ((stub["weekly_hours"] * stub["hourly_pay"]) + stub["weekly_tips"])
                })

                let object = {
                    "restaurant name": item["name"],
                    "restaurant zip": item["zip_code"],
                    "average hourly": weeklyComp/weeklyHours
                }
                
                payStubArray.push(object);    
            
        })

        let zipObjectArray = [];
        let zipArray = [];
        payStubArray.forEach(item => {
            // if zip code has not been added to arrays
            if (zipArray.indexOf(item["restaurant zip"]) == -1){
                let object = {
                    "zip": item["restaurant zip"],
                    "runningComp" : item["average hourly"],
                    "count": 1,
                }
                zipObjectArray.push(object);
                zipArray.push(item["restaurant zip"]);
            } else {
                let index = zipArray.indexOf(item["restaurant zip"]);
                zipObjectArray[index]["runningComp"] += item["average hourly"];
                zipObjectArray[index]["count"] += 1;
            }
            
        })
        let finalArray = [];
        zipObjectArray.forEach(item => {
            let object = {
                "zip": item["zip"],
                "average": Math.round((100*item["runningComp"])/(item["count"]))/100
            }
            finalArray.push(object);
        })

        return res.json(finalArray);
    })
    .catch (err => res.json(err))
}

exports.top_five_zips = (req,res, next) => {
    Restaurant.aggregate([{
    $lookup:
        {
          from: "pays",
          localField: "_id",
          foreignField: "restaurant",
          as: "paystubs"
        }
   }
]).then(aggregate => {
    let payArray = Array.from(aggregate);

    let payStubArray = [];
    
    
    payArray.forEach(item => {
            
            let weeklyHours = 0;
            let weeklyComp = 0;

            let stubs = Array.from(item["paystubs"]);

            stubs.forEach(stub => {
                weeklyHours += stub["weekly_hours"];
                weeklyComp += ((stub["weekly_hours"] * stub["hourly_pay"]) + stub["weekly_tips"])
            })

            let object = {
                "restaurant name": item["name"],
                "restaurant zip": item["zip_code"],
                "average hourly": weeklyComp/weeklyHours
            }
            
            payStubArray.push(object);    
        
    })

    let zipObjectArray = [];
    let zipArray = [];
    payStubArray.forEach(item => {
        // if zip code has not been added to arrays
        if (zipArray.indexOf(item["restaurant zip"]) == -1){
            let object = {
                "zip": item["restaurant zip"],
                "runningComp" : item["average hourly"],
                "count": 1,
            }
            zipObjectArray.push(object);
            zipArray.push(item["restaurant zip"]);
        } else {
            let index = zipArray.indexOf(item["restaurant zip"]);
            zipObjectArray[index]["runningComp"] += item["average hourly"];
            zipObjectArray[index]["count"] += 1;
        }
        
    })
    let cleanArray = [];
    zipObjectArray.forEach(item => {
        let average = Math.round((100*item["runningComp"])/(item["count"]))/100;
        if (!average){
            average = 0.01;
        }
        let object = {
            "zip": item["zip"],
            "average": average
        }
        cleanArray.push(object);
    })

    cleanArray.sort((a,b) => (a.average < b.average) ? 1 : -1);
    let finalArray = cleanArray.slice(0,5);

    return res.json(finalArray);
})
.catch (err => res.json(err))
}

exports.pay_by_entree =(req,res, next) => {
    
    Restaurant.aggregate([{
        $lookup:
            {
              from: "pays",
              localField: "_id",
              foreignField: "restaurant",
              as: "paystubs"
            }
       }
    ]).then(aggregate => {
        let payArray = Array.from(aggregate);
        let payStubArray = [];
        let runningTotal = 0;
        let stubCount = 0;
        payArray.forEach(item => {
            
            
            if (item["entree_price"] == req.params.rating){
                
                let weeklyHours = 0;
                let weeklyComp = 0;

                let stubs = Array.from(item["paystubs"]);

                stubs.forEach(stub => {
                    weeklyHours += stub["weekly_hours"];
                    weeklyComp += ((stub["weekly_hours"] * stub["hourly_pay"]) + stub["weekly_tips"])
                })

                let object = {
                    "restaurant name": item["name"],
                    "average hourly": weeklyComp/weeklyHours
                }
                
                payStubArray.push(object);    
            }
            
        })
        payStubArray.forEach(item => {
            runningTotal += item["average hourly"];
            stubCount += 1;
        })
        let average = Math.round(100*(runningTotal/stubCount))/100;
        if (!average){
            average = 0.01;
        }
        let object = {
            "entree_price" : req.params.rating,
            "running_total": runningTotal,
            "stub_count": stubCount,
            "average": average
        }
        return res.json(object);
    })
    .catch (err => res.json(err))
}

exports.all_pay_by_entree =  (req,res, next) => {
    
    Restaurant.aggregate([{
        $lookup:
            {
              from: "pays",
              localField: "_id",
              foreignField: "restaurant",
              as: "paystubs"
            }
       }
    ]).then(aggregate => {
        let payArray = Array.from(aggregate);

        let payStubArray = [];
        
        
        payArray.forEach(item => {
                
                let weeklyHours = 0;
                let weeklyComp = 0;

                let stubs = Array.from(item["paystubs"]);

                stubs.forEach(stub => {
                    weeklyHours += stub["weekly_hours"];
                    weeklyComp += ((stub["weekly_hours"] * stub["hourly_pay"]) + stub["weekly_tips"])
                })

                let object = {
                    "restaurant name": item["name"],
                    "entree_price": item["entree_price"],
                    "average hourly": weeklyComp/weeklyHours
                }
                
                payStubArray.push(object);    
            
        })

         let entreeObjectArray = [];
        
         payStubArray.forEach(item => {

            let index = item["entree_price"] - 1;
            if (entreeObjectArray[index] == null){
                let average = item["average hourly"]
                if (!average){
                    average = 0.01;
                }
                let object = {
                    "entree_price": item["entree_price"],
                    "runningComp" : average,
                    "count": 1,
                }
                entreeObjectArray[index] = object;
            } else {
                let average = item["average hourly"]
                if (!average){
                    average = 0.01;
                }
                entreeObjectArray[index]["runningComp"] += average;
                entreeObjectArray[index]["count"] += 1;
            }
            
        })
        let finalArray = [];
         entreeObjectArray.forEach(item => {
            let average = Math.round((100*item["runningComp"])/(item["count"]))/100
            if (!average){
                average = 0.01;
            }
            let object = {
                "entree_price": item["entree_price"],
                "average": average
            }
            finalArray.push(object);
        })

        return res.json(finalArray);
    })
    .catch (err => res.json(err))
}

exports.pay_by_zip_and_entree = (req,res, next) => {
    
    Restaurant.aggregate([{
        $lookup:
            {
              from: "pays",
              localField: "_id",
              foreignField: "restaurant",
              as: "paystubs"
            }
       }
    ]).then(aggregate => {
        let payArray = Array.from(aggregate);
        let payStubArray = [];
        let runningTotal = 0;
        let stubCount = 0;
        payArray.forEach(item => {
            
            
            if (item["zip_code"] == req.params.zip && item["entree_price"] == req.params.entree){
                
                let weeklyHours = 0;
                let weeklyComp = 0;

                let stubs = Array.from(item["paystubs"]);

                stubs.forEach(stub => {
                    weeklyHours += stub["weekly_hours"];
                    weeklyComp += ((stub["weekly_hours"] * stub["hourly_pay"]) + stub["weekly_tips"])
                })

                let object = {
                    "restaurant name": item["name"],
                    "average hourly": weeklyComp/weeklyHours
                }
                
                payStubArray.push(object);    
            }
            
        })
        payStubArray.forEach(item => {
            runningTotal += item["average hourly"];
            stubCount += 1;
        })
        let object = {
            "zip_code" : req.params.zip,
            "entree price": req.params.entree,
            "running_total": runningTotal,
            "stub_count": stubCount,
            "average": Math.round(100*(runningTotal/stubCount))/100
        }
        return res.json(object);
    })
    .catch (err => res.json(err))
}

exports.pay_create_get = (req,res, next) => {
    Restaurant.find()
    .then( restaurantsList => {
        let object = {
            "title": "Create Pay Record",
            "restaurants": restaurantsList
        }
        return res.json(object);
    })
    .catch(err => res.json(err));
        
}

exports.pay_create_post = (req,res, next) => {
        
    const errors = validationResult(req);

    let pay = new Pay({
        hourly_pay: req.body.hourly_pay,
        weekly_tips: req.body.weekly_tips,
        weekly_hours: req.body.weekly_hours,
        restaurant: req.body.restaurant,
    });
    if(!errors.isEmpty()){
        Restaurant.find()
        .then( restaurantsList => {
            let object = {
                "title": "Create Pay Record",
                "restaurants": restaurantsList,
                "pay": pay, 
                "errors":errors.array() 
            }
            return res.json(object);
        })
        .catch(err => res.json(err));
    } else {
        pay.save(function(err){
            if (err) { return next(err); }
            return res.json({"status":"pay added"});
        });
    }
}