

// set up server 
var express = 			require('express');
var app = 				express();

// the order is important here!
var port = 				process.env.PORT || 8080; 
var http = 				require('http').Server(app);
var io = 				require('socket.io')(http);
http.listen(port);

var mongoose = 			require('mongoose');
var passport = 			require('passport');
var flash = 			require('connect-flash');

var cookieParser = 		require('cookie-parser');
var bodyParser = 		require('body-parser');
var session = 			require('express-session');
var assert =		    require('assert');
var mongoStore = 		require("connect-mongo");


var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
require('./config/passport.js')(passport);
app.use(cookieParser()); 		
app.use(bodyParser()); 			
app.set('view engine', 'ejs');

var sessionMiddleware = session({
	secret: 'atchounyemek',
	store: new (mongoStore(session))({
		url: configDB.url
	})
});

app.use(sessionMiddleware);			// use the sessionMiddlware variable for cookies 			
app.use(passport.initialize());	   	// start up passport
app.use(passport.session());	    // persistent login session (what does that mean?)
app.use(flash()); 		            // connect-flash is used for flash messages stored in session.

// pass app and passport to the routes 
require('./routes/routes.js')(app, passport);

// this stuff is for handling the chat functionality of the application.

// connect the sessionMiddleware with socket.io so we can get user session info 
io.use(function(socket, next){
	sessionMiddleware(socket.request, {}, next);
});

// array to store all currently logged in users 
var users = [];
io.on('connection', function(socket){
	
	// see if can get logged-in user info 
	// didn't get what I thought I would get. are usernames stored with sessions?
	// console.log(socket.request.session.passport);
	socket.on('userConnected', function(username){
		if(users.indexOf(username) < 0){
			users.push(username);
		}
		io.emit('getCurrentUsers', users);
	});
	
	// when a user disconnects, update current users and emit new updated list to everyone
	socket.on('userHasDisconnected', function(username){
		var indexOfUsername = users.indexOf(username);
		users.splice(1, indexOfUsername);
		io.emit('getCurrentUsers', users);
	});
	
	socket.on('chat message', function(msg){
		// this is the server sending out the message to every client
		
		// get current date and time
		var timestamp = new Date().toLocaleString();
		
		
		io.emit('chat message', msg.user + ": " + msg.msg + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 " + timestamp);
	});
	
	socket.on('image', function(img){
		io.emit('image', img);
	});
});

http.listen(port, function(){
	console.log('listening on *:' + port);
});

