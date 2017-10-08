var express = require('express');
var db = require('../models');
var isLoggedIn = require('../middleware/isLoggedIn');
var ejsLayouts = require('express-ejs-layouts');
var passport = require('../config/ppConfig');
var Twitter = require('twitter');
var router = express.Router();

var twitter = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: '344317888-SugC9OFN9oScXTFGyvszwSmwUwXbAoVNQGoydTlf',
	access_token_secret: 'onLIVSGl6isHJQ0CIcyReg3uhA5QeFygK9Q8jMF8IFW8f'
})

router.get('/', isLoggedIn, function(req, res) {
  res.render('dashboard');
});

router.get('/facebook', isLoggedIn, function(req, res) {
	res.render('facebook');
})

router.get('/twitter', isLoggedIn, function(req, res) {
	twitter.get('statuses/home_timeline', {screen_name: 'nodejs', count: 5}, function(error, tweets, response) {
		if(!error) {
			res.render('twitter', {title: 'Express', tweets: tweets});
			console.log(tweets);
		} else {
			res.status(500).json({error: error});
		}
	})

})



module.exports = router;