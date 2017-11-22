var express = require('express');
var db = require('../models');
var isLoggedIn = require('../middleware/isLoggedIn');
var ejsLayouts = require('express-ejs-layouts');
var passport = require('../config/ppConfig');
var request = require('request');
var router = express.Router();
var key = process.env.API_KEY;
var bodyParser = require('body-parser')


/* FOR THE DASHBOARD / GENERAL CUSTOMIZATION */
router.get('/', isLoggedIn, function(req, res) {
	db.preference.findOrCreate({
		where: {userId: req.user.id}
	}).spread(function(preference, created) {
		console.log(preference)
		res.render('dashboard', {preference: preference, user: req.user})
	})
	console.log(req.user)
})

// Add a put route to help users see in place the color for the nav bar

router.post('/nav-color', isLoggedIn, function(req, res) {
	var navColor = req.body.navColor
	db.preference.update({
		navColor: navColor
	}, {
		where: {userId: req.user.id}
	}).then(function(preference) {
		res.redirect('/profile')
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

// WEATHER ROUTES

router.get('/weather', isLoggedIn, function(req, res) {
	res.render('weather', {user: req.user})
})

	//THIS ROUTE IS ACTUALLY EXCUTED FROM THE RESULTS PAGE OF THE SEARCH-WEATHER ROUTE
router.post('/weather', isLoggedIn, function(req, res) {
	db.weather.findOrCreate({
	  where: {
	    userId: req.user.id,
	    url: req.body.url
	  },
	  defaults: { url: req.body.url }
	}).spread(function(weather, created) {
	  console.log(weather);
	  db.preference.find({
	  	where: {userId: req.user.id}
	  }).then(function(preference) {
	  	res.redirect('/profile/weather');
	  })
	});
})

router.get('/search-weather', isLoggedIn, function(req, res) {
	res.render('search-weather', {user: req.user});
})

	//THIS ROUTE IS USED TO ACTUALLY SEARCH AND GIVE A RESPONSE TO LOCATION
router.post('/search-weather', isLoggedIn, function(req, res) {
	var city = req.body.city;
	var state = req.body.state;
	var url = 'http://api.wunderground.com/api/' + key + '/conditions/q/' + state + '/' + city + '.json';
	request(url, function(error, response, body) {
		if(error) {
			console.log(error);
		} else {
			var weather = JSON.parse(body);
			res.render('results', {weather: weather, user: req.user, url: url});
		}
	});
})





module.exports = router;