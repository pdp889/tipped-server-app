require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')

var indexRouter = require('./routes/index');
let databaseRouter = require('./routes/database');
let apiRouter = require('./routes/api')

var cors = require('cors')
var app = express()
app.use(cors())

//set up MongoDB
const mongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lwhet.mongodb.net/server_app?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));


passport.use(
  new LocalStrategy((username, password, done) => {
    
    User.findOne({ username: username }, (err, user) => {
      if (err) { 
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (bcrypt.compare(password, user.password, (err, res) => {
        if (err) { 
          return done(err);
        }
        if (res) {
          // passwords match! log user in
          return done(null, user)
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" })
        }
      })) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
app.use(express.urlencoded({ extended: false }));

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);
app.get("/signout", (req, res) => {
  req.logout();
  res.redirect("/");
});
app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});
// changes
app.use('/APIlogin', (req, res) => {
  res.send({
    token: 'test123'
  });
}); 
// changes end
app.use('/database', databaseRouter);
app.use('/api', apiRouter)

const User = mongoose.model(
  "User",
  new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
  })
);

app.get('/signup', function(req, res, next) {
  res.render('sign_up');
});

app.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function(err, hash){
    if (err) { 
      return next(err);
    }
    const user = new User({
      username: req.body.username,
      password: hash
    }).save(err => {
      if (err) { 
        return next(err);
      }
      res.redirect("/");
    });
  }) 
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
