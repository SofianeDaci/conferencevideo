var User = require('../models/user.js');
var confernece = require('./conference');

module.exports = function (app, passport) {
	app.get('/', function (req, res) {
		res.render('login.ejs', { message: "" });
	});

	app.get('/userlogin', function (req, res) {
		res.render('login.ejs', {
			message: req.flash('loginMessage'),
		});
	});

	app.get('/chat', function (req, res) {
		res.render('index.ejs', {
			user: req.user
		});
	});

	app.post('/userlogin', passport.authenticate('local-login', {
		failureRedirect: '/login',
		failureFlash: true
	}), function (req, res) {

		res.redirect('/confList/');
	});

	app.get('/userregister', function (req, res) {
		res.render('register.ejs', { message: req.flash('registerMessage') });
	});

	app.post('/userregister', passport.authenticate('local-register', {
		successRedirect: '/confList',
		failureRedirect: '/register',
		failureFlash: true
	}));

	app.use('/confList/get', confernece);


	app.get('/confList/', function (req, res) {
		res.render('confList.ejs', {
			user: req.user,
			confernece: req.confernece
		});
	});

	app.post('/confList/post', function (req, res) {
		res.confernece.add;
	});

	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});
}
