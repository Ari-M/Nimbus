//PREVIOUS COPY OF CODE OF /PROFILE/


var express = require('express');
var db = require('../models');
var isLoggedIn = require('../middleware/isLoggedIn');
var ejsLayouts = require('express-ejs-layouts');
var passport = require('../config/ppConfig');
var request = require('request');
var axios = require('axios');
var async = require('async');
var router = express.Router();
var key = process.env.API_KEY;
var bodyParser = require('body-parser')

// ROUTES FOR THE HOME (/PROFILE) PAGE
router.get('/', isLoggedIn, function(req, res) {
	/*
		NOTE: Originally the intent of this route and the code here was to be able to find every instance of a weather entry in the
		weather database that has the userId of the user's id and make a request to it, then I can grab the object of results
		from the API and and push it into an array called locations. However, I encountered a problem where every time I would push to the array, 
		it would not show up in the array. No problems would show up which was equally confusing. Even more odd, is that even though I wrote code 
		to console.log(locations), locations would display first before the data. So I believe that that the problem is a timing issue that I 
		would have to do some more thorough research in to make a clean fix. I have an idea where I could hardcode a limit and instead of doing
		a loop to instead hardcode the same request function to match the number of the limit but that would be messy. So I will just stick with
		this.
	*/

	db.weather.find({
		where: {userId: req.user.id}
	}).then(function(result) {
		console.log(result.dataValues.url)
		var url = result.dataValues.url
		request(url, function(error, response, body) {
			if(error) {
				console.log(error);
			} else {
				var weather = JSON.parse(body);
				db.preference.findOrCreate({
					where: {userId: req.user.id}
				}).spread(function(preference, created) {
					res.render('weather', {weather: weather, user: req.user, preference: preference});
				})
			}
		});
	}).catch(function (err) {
	  res.render('start1', {user: req.user});
	});
})

router.post('/', isLoggedIn, function(req, res) {
	var city = req.body.city;
	var state = req.body.state;
	var url = 'http://api.wunderground.com/api/' + key + '/conditions/q/' + state + '/' + city + '.json';
	db.weather.create({
		url: url,
		userId: req.user.id
	}).then(function(data) {
		res.redirect('/profile');
	})
})
// END ROOT

/////////////////////////////////////////////////////////////

// ROUTES FOR PROFILE/SEARCH-WEATHER

router.get('/search-weather', isLoggedIn, function(req, res) {
	db.preference.find({
		where: {userId: req.user.id}
	}).then(function(preference) {
		res.render('search-weather', {user: req.user, preference, preference})
	})
})

router.post('/search-weather', isLoggedIn, function(req, res) {
	var city = req.body.city;
	var state = req.body.state;
	var url = 'http://api.wunderground.com/api/' + key + '/conditions/q/' + state + '/' + city + '.json';
	request(url, function(error, response, body) {
		if(error) {
			console.log(error);
		} else {
			var weather = JSON.parse(body);
			db.preference.find({
				where: {userId: req.user.id}
			}).then(function(preference) {
				res.render('results', {user: req.user, preference, preference, url: url, weather: weather})
			})
		}
	});
})

// END /PROFILE/SEARCH-WEATHER

/////////////////////////////////////////////////////////////

// ROUTES FOR THE DASHBOARD / GENERAL CUSTOMIZATION 

router.get('/settings', isLoggedIn, function(req, res) {
	db.preference.find({
			where: {userId: req.user.id}
		}).then(function(preference, created) {
			res.render('dashboard', {preference: preference, user: req.user})
		})
})

router.delete('/delete', isLoggedIn, function(req, res) {
	// CHANGED DELETE ROUTE FROM '/' TO '/DELETE' TO FURTHER SPECIFY FROM A ROUTE PERSPECTIVE OF WHAT THE INTENT IS
	db.weather.destroy({
		where:  {userId: req.user.id}
	}).then(function() {
		db.preference.destroy({
			where: {userId: req.user.id}
		}).then(function() {
			db.user.destroy({
				where: {id: req.user.id}
			}).then(function() {

			})
		})
	})
})

router.put('/name', isLoggedIn, function(req, res) {
	console.log(req.body);
	db.user.update({
	  name: req.body.accountName
	}, {
	  where: {
	    id: req.user.id
	  }
	}).then(function(user) {
		res.redirect('/profile/settings')
	});
})

router.post('/navcolor', isLoggedIn, function(req, res) {
	var navColor = req.body.navColor
	db.preference.update({
		navColor: navColor
	}, {
		where: {userId: req.user.id}
	}).then(function(preference) {
		res.redirect('/profile/settings')
	})
})
	

router.delete('/navcolor', isLoggedIn, function(req, res) {
	console.log(req.user.id)
	db.preference.destroy({
		where: {userId: req.user.id}
	}).then(function() {
		res.redirect('/profile/settings')
	})
})
// END


module.exports = router;