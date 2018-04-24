var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var router = express.Router();

router.get('/blog', function (req, res) {
	res.render('update')
})

module.exports = router;