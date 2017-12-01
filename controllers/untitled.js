/* FOR THE DASHBOARD / GENERAL CUSTOMIZATION */
router.get('/settings', isLoggedIn, function(req, res) {
	db.preference.findOrCreate({
		where: {userId: req.user.id}
	}).spread(function(preference, created) {
		res.render('dashboard', {preference: preference, user: req.user})
	})
})

router.delete('/delete', isLoggedIn, function(req, res) {
	// CHANGED DELETE ROUTE FROM / TO /DELETE IN THE INSTANCE TO FURTHER SPECIFY FROM A ROUTE PERSPECTIVE OF WHAT THE INTENT IS
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
		res.redirect('/profile');
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