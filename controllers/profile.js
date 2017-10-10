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
	db.preference.findOne({
		where: {userId: req.user.id}
	}).then(function(preference) {
		console.log(user)
		res.render('dashboard', {preference: preference})
	})
})

router.post('/dashboard', isLoggedIn, function(req, res) {
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
			author.createPreference({
				navColor: navColor
			}).then(function(preference) {
				console.log(preference);
				res.redirect('/');  
			})
		})
	})

})

router.get('/facebook', isLoggedIn, function(req, res) {
	res.render('facebook');
})

router.get('/twitter', isLoggedIn, function(req, res) {
	twitter.get('statuses/home_timeline', {screen_name: 'nodejs', count: 6}, function(error, tweets, response) {
		if(!error) {
			//res.render('twitter', {title: 'Express', tweets: tweets});
			db.user.findOne({
				where: {id: req.user.id}
			}).then(function(user) {
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



module.exports = router;