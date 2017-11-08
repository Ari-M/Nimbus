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
/* FOR THE DASHBOARD / GENERAL CUSTOMIZATION */
router.get('/', isLoggedIn, function(req, res) {
	db.preference.findOrCreate({
		where: {userId: req.user.id}
	}).spread(function(preference, created) {
		console.log(preference)
		res.render('dashboard', {preference: preference})
	})
})

// Add a put route to help useres see in place the color for the nav bar

router.post('/nav-color', isLoggedIn, function(req, res) {
	var email = req.user.email;
	var navColor = req.body.navColor;
	console.log(navColor);
	db.user.findOne({
		where: {email: email}
	}).then(function(user) {
		console.log(email);
		db.preference.findOrCreate({
			where: {userId: req.user.id}
		}).spread(function(preference, created){
			db.preference.update({
				navColor: navColor
			}, {
				where: {userId: req.user.id}
			}).then(function(preference) {
				console.log(preference);
				res.redirect('/profile');  
			})
		})
	})

})

router.delete('/navcolor', isLoggedIn, function(req, res) {
	console.log(req.user.id)
	db.preference.destroy({
		where: {userId: req.user.id}
	}).then(function() {
		res.redirect('/profile')
	})
})
/* END */

/* FOR THE FACEBOOK VIEW / NOT CURRENTLY DEVELOPED DUE TO ISSUES WITH API */
router.get('/facebook', isLoggedIn, function(req, res) {
	db.preference.findOne({
		where: {userId: req.user.id}
	}).then(function(preference) {
		console.log(preference)
		res.render('facebook', {preference: preference})
	})
})
/* END */

/* TWITTER ROUTES / CURRENTLY BEING DEVELOPED */
router.get('/twitter', isLoggedIn, function(req, res) {
	twitter.get('statuses/home_timeline', {screen_name: 'nodejs', count: 10}, function(error, tweets, response) {
		if(!error) {
			db.user.findOne({
				where: {email: req.user.email}
			}).then(function(user) {
				console.log(tweets)
				db.preference.findOrCreate({
					where: {userId: req.user.id}
				}).spread(function(preference, created){
					console.log(created)
					console.log(preference)
					res.render('twitter', {title: 'Express', tweets: tweets, user: user, preference: preference});
				})
			})

		} else {
			res.status(500).json({error: error});
		}
	})

})
/* END */
module.exports = router;