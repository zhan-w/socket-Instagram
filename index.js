var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var morgan = require('morgan');
var instagram = require('instagram-node-lib')
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.set('views', './views');
app.set('view engine', 'ejs');

instagram.set('client_id', process.env.INSTAGRAM_CLIENT_ID);
instagram.set('client_secret', process.env.INSTAGRAM_CLIENT_SECRET);

instagram.set('callback_url', 'http://28a09bbc.ngrok.io/callback');
instagram.set('maxsockets', 50);

// console.log(instagram);

app.get("/", function (req, res) {
	res.render('index');
});

app.get('/callback', function (req, res){
  instagram.subscriptions.handshake(req, res); 
});

app.post('/callback', function (req, res){
	var data = req.body;
	io.sockets.emit('instagram', data);

});

server.listen(port, function() {
	console.log('listening');
});

var tags = ['new york', 'london', 'tokyo'];

for (var i = 0; i < tags.length; i++) {
	instagram.subscriptions.subscribe({ 
		object: 'tag',
	  object_id: tags[i]
	});
}

// instagram.subscriptions.list()

io.sockets.on('connect', function (socket) {
	console.log('connected');
});



