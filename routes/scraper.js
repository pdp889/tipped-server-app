let express = require('express');
let router = express.Router();

let scraper_controller = require('../controllers/scraperController');

router.get('/', scraper_controller.getAllJobs_get);


module.exports = router;