var express = require('express');
var db = require('../models');
var isLoggedIn = require('../middleware/isLoggedIn');
var ejsLayouts = require('express-ejs-layouts');
var passport = require('../config/ppConfig');
var router = express.Router();

router.get('/', isLoggedIn, function(req, res) {
  res.render('dashboard');
});

router.get('/facebook', isLoggedIn, function(req, res) {
	res.render('facebook');
})

router.get('/twitter', isLoggedIn, function(req, res) {
	res.render('twitter');
})



module.exports = router;