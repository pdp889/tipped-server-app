let express = require('express');
let router = express.Router();
let passport = require('passport');
require('../passportLocal');

let authController = require('../controllers/authController');

router.get('/signup', authController.sign_up_get);
router.post('/signup', authController.sign_up_post);
router.get('/login', authController.log_in_get);
router.post('/login', passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/auth/failedlogin"
})
);
router.get('/log-out', (req, res) => {
    req.logout();
    res.redirect("/");
  });

  router.get('/failedlogin', (req, res) => {
    res.render("failedlogin");
  });
module.exports = router;

