const axios = require('axios');
const cheerio = require('cherio');
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
const decoder = require('jwt-decode');

// Helper methods for getAllJobs_get function
async function getZipCodeInfo (zip){
    
    let aggregate = await Restaurant.aggregate([{
        $lookup:
            {
              from: "pays",
              localField: "_id",
              foreignField: "restaurant",
              as: "paystubs"
            }
       }
    ]);
    let payArray = Array.from(aggregate);
    let payStubArray = [];
    let runningTotal = 0;
    let stubCount = 0;
    payArray.forEach(item => {
            
        if (item["zip_code"] - zip == 0){
            console.log ('BOOM');
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
    return (Math.round(100*(runningTotal/stubCount))/100);
};
async function checkZipCodes (jobsList) { 
    const finalList = [];
    await (async function () {
        for (let i = 0; i<jobsList.length; i++) {
            let average = await getZipCodeInfo(jobsList[i].location);
            if (!average){
                jobsList[i].average = 'unknown'
            } else {
                jobsList[i].average = average;
            }
            const obj = {title: jobsList[i].title, restaurant: jobsList[i].restaurant, location: jobsList[i].location, url: jobsList[i].url, average: jobsList[i].average};
            
            finalList.push(obj);
        }
    })();

    return finalList;
};

exports.getAllJobs_get = function (req, res, next) {
    


    

    (async function () { 
        let jobsList = await (async function () {
            const url = 'https://www.postjobfree.com/jobs?q=restaurant+server&l=Omaha%2c+NE&radius=10';
            const jobsList = [];
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            const divSet = $('.snippetPadding');
            divSet.each(function () {
                const title = $(this).find('.itemTitle > a').text();
                const restaurant = $(this).find('.colorCompany').text();
                let locationScraper = $(this).find('.colorLocation').text();
                let locationArray = locationScraper.split(',');
                location = locationArray[locationArray.length - 1];
                let url  = $(this).find('.itemTitle > a').attr('href');
                url = 'https://www.postjobfree.com' + url;
                jobsList.push({title, restaurant, location, url}) 
            })
        console.log('checkpoint 1'); 
        console.log(jobsList);
        let final = await checkZipCodes(jobsList);
        console.log('checkpoint 2: before final log'); 
        console.log(final);
        console.log('checkpoint 3: after final log');    
        return final;
        })();
        res.render('jobs', {title:'Live Job List', jobs: jobsList})
    })();

}

exports.getAllJobsAPI_get = function (req, res, next) {
    


    

    (async function () { 
        let jobsList = await (async function () {
            const url = 'https://www.postjobfree.com/jobs?q=restaurant+server&l=Omaha%2c+NE&radius=10';
            const jobsList = [];
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            const divSet = $('.snippetPadding');
            divSet.each(function () {
                const title = $(this).find('.itemTitle > a').text();
                const restaurant = $(this).find('.colorCompany').text();
                let locationScraper = $(this).find('.colorLocation').text();
                let locationArray = locationScraper.split(',');
                location = locationArray[locationArray.length - 1];
                let url  = $(this).find('.itemTitle > a').attr('href');
                url = 'https://www.postjobfree.com' + url;
                jobsList.push({title, restaurant, location, url}) 
            })
        console.log('checkpoint 1'); 
        console.log(jobsList);
        let final = await checkZipCodes(jobsList);
        console.log('checkpoint 2: before final log'); 
        console.log(final);
        console.log('checkpoint 3: after final log');    
        return final;
        })();
        res.json({jobs: jobsList})
    })();

}