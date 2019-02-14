var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');


module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	passport.use('local-register', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
		function (req, username, password, done) {


			process.nextTick(function () {

				User.findOne({ 'local.username': username }, function (err, user) {

					if (err) {
						return done(err);
					}

					if (user) {
						return done(null, false, req.flash('registerMessage', 'ERREUR: Le compte existe déjà'));
					} else {
						var newUser = new User();

						newUser.local.username = username;
						newUser.local.password = newUser.generateHash(password);

						//Enregistrer le nouvel user
						newUser.save(function (err) {
							if (err) {
								throw err;
							}
							return done(null, newUser);
						});
					}
				});
			});

		}));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
		function (req, username, password, done) {

			User.findOne({ 'local.username': username }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (!user) {

					return done(null, false, req.flash('loginMessage', 'Erreur: Le compte est inexistant'));
				}

				if (!user.validPassword(password)) {
					return done(null, false, req.flash('loginMessage', 'Le mot de passe ne correspond pas'));
				}

				return done(null, user);
			});
		}));
}