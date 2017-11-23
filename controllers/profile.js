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


/* FOR THE DASHBOARD / GENERAL CUSTOMIZATION */
router.get('/', isLoggedIn, function(req, res) {
	db.preference.findOrCreate({
		where: {userId: req.user.id}
	}).spread(function(preference, created) {
		res.render('dashboard', {preference: preference, user: req.user})
	})
})

router.delete('/', isLoggedIn, function(req, res) {
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

	});
})

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
	// NOTE: ORIGINALLY THE INTENT WAS TO GRAB MUTLIPLE LOCATIONS HOWEVER DUE TO TIME CONSTRAINTS
	// AND AN ASYNC REQUEST PROBLEM I AM NOT ABLE TO GRAB EVERY OBJECT BACK SO I AM ONLY LIMITED TO ONE LOCATION
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
				db.preference.find({
					where: {userId: req.user.id}
				}).then(function(preference) {
					res.render('weather', {weather: weather, user: req.user, preference: preference});
				})
			}
		});
	}).catch(function (err) {
	  res.redirect('/profile/search-weather');
	});
})

	//THIS ROUTE IS ACTUALLY EXCUTED FROM THE RESULTS PAGE OF THE SEARCH-WEATHER ROUTE
router.post('/weather', isLoggedIn, function(req, res) {
	db.weather.create({
		url: req.body.url,
		userId: req.user.id
	}).then(function(data) {
		res.redirect('/profile/weather');
	})
})

router.get('/search-weather', isLoggedIn, function(req, res) {
	db.preference.find({
		where: {userId: req.user.id}
	}).then(function(preference) {
		res.render('search-weather', {user: req.user, preference, preference})
	})
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
			db.preference.find({
				where: {userId: req.user.id}
			}).then(function(preference) {
				res.render('results', {user: req.user, preference, preference, url: url, weather: weather})
			})
		}
	});
})





module.exports = router;