var https = require("https");
var fs = require("fs");
var url =  require('url');
var socketio = require('socket.io');

var options = {
  key: fs.readFileSync('my-key.pem'),
  cert: fs.readFileSync('my-cert.pem')
};

function handleIt(req,res){
	var parseUrl = url.parse(req.url);
	var path = parseUrl.pathname;
	if (path == "/") {
		path = "index.html";
	}
	fs.readFile(__dirname + path,

		// Callback function for reading
		function (err, fileContents) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + req.url);
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(fileContents);
  		}
  	);	
}

var httpServer = https.createServer(options,handleIt);
httpServer.listen(8081);
console.log("listening on 8081");

var io = socketio.listen(httpServer);

io.sockets.on('connection',function(socket){


	console.log("we have a client: "+socket.id);

	socket.on('disconnect', function() {
		console.log("client disconnected: "+socket.id);
	});





});