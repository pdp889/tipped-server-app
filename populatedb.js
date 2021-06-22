
// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Pay = require('./models/pay')
var Restaurant = require('./models/restaurant')
var User = require('./models/user')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var restaurants = []
var users = []
var pays = []

function restaurantCreate(zip_code, name, entree_price, cb) {
  
  var restaurant = new Restaurant({zip_code: zip_code, name: name, entree_price: entree_price});
       
  restaurant.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Restaurant: ' + restaurant);
    restaurants.push(restaurant)
    cb(null, restaurant)
  }  );
}

function userCreate(email, cb) {
  var user = new User({ email: email});
       
  user.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New User: ' + user);
    users.push(user)
    cb(null, user);
  }   );
}

function payCreate(hourly_pay, weekly_tips, weekly_hours, restaurant, user, cb) {
  payDetail = { 
    hourly_pay: hourly_pay,
    weekly_tips: weekly_tips,
    weekly_hours: weekly_hours,
    restaurant: restaurant,
    user: user
  }
  
    
  var pay = new Pay(payDetail);    
  pay.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Pay: ' + pay);
    pays.push(pay)
    cb(null, pay)
  }  );
}

function createRestaurants(cb) {
    async.series([
        function(callback) {
          restaurantCreate('68114', 'Outback Steakhouse', 22, callback);
        },
        function(callback) {
          restaurantCreate('68114', "Fleming's Prime Steakhouse & Wine Bar", 75, callback);
        },
        function(callback) {
          restaurantCreate('68118', 'Firebirds Wood Fired Grill', 40, callback);
        },
        function(callback) {
            restaurantCreate('68104', 'Yoshitomo', 33, callback);
        },
        function(callback) {
            restaurantCreate('68102', 'La Buvette Wine & Grocery', 30, callback);
        }
        ],
        // optional callback
        cb);
}


function createUsers(cb) {
    async.parallel([
        function(callback) {
          userCreate('goodserver1@hotmail.com', callback);
        },
        function(callback) {
            userCreate('goodserver2@hotmail.com', callback);
        },
        function(callback) {
            userCreate('goodserver3@hotmail.com', callback);
        },
        function(callback) {
            userCreate('goodserver4@hotmail.com', callback);
        },
        function(callback) {
            userCreate('goodserver5@hotmail.com', callback);
        },
        function(callback) {
            userCreate('goodserver6@hotmail.com', callback);
        },
        function(callback) {
            userCreate('goodserver7@hotmail.com', callback);
        },
        function(callback) {
            userCreate('goodserver8@hotmail.com', callback);
        },
        function(callback) {
            userCreate('goodserver9@hotmail.com', callback);
        },
        function(callback) {
            userCreate('goodserver10@hotmail.com', callback);
        }
        ],
        // optional callback
        cb);
}


function createPays(cb) {
    async.parallel([
        function(callback) {
          payCreate(2.13, 600, 30, restaurants[0], users[0], callback)
        },
        function(callback) {
            payCreate(2.13, 700, 30, restaurants[0], users[1], callback)
        },
        function(callback) {
            payCreate(2.13, 1500, 40, restaurants[1], users[2], callback)
        },
        function(callback) {
            payCreate(2.13, 800, 30, restaurants[2], users[3], callback)
        },
        function(callback) {
            payCreate(2.13, 1100, 40, restaurants[2], users[4], callback)
        },
        function(callback) {
            payCreate(2.13, 600, 20, restaurants[2], users[5], callback)
        },
        function(callback) {
            payCreate(4.50, 700, 30, restaurants[3], users[6], callback)
        },
        function(callback) {
            payCreate(4.50, 1000, 40, restaurants[3], users[7], callback)
        },
        function(callback) {
            payCreate(7.50, 1200, 35, restaurants[4], users[8], callback)
        },
        function(callback) {
            payCreate(7.50, 2000, 55, restaurants[4], users[9], callback)
        }
        ],
        // Optional callback
        cb);
}



async.series([
    createRestaurants,
    createUsers,
    createPays
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+ err);
    }
    else {
        console.log('Pays: '+ pays);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});

