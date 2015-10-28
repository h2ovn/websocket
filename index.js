var WebSocketServer = require('websocket').server;
var http = require('http');
var clients = [];
var groups = [];

function getGroupCode(){

}

var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
});

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8003
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
 
server.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

function sendCallback(err) {
    if (err) console.error("send() error: " + err);
}

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
    var connection = request.accept(null, request.origin);
    console.log(' Connection ' + connection.remoteAddress);
    clients.push(connection);
    
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // process WebSocket message
            console.log((new Date()) + ' Received Message ' + message.utf8Data);
            // broadcast message to all connected clients
            clients.forEach(function (outputConnection) {
                if (outputConnection != connection) {
                  outputConnection.send(message.utf8Data, sendCallback);
                }
            });
        }
    });
    // register code
    connection.on('register', function() {
        // process WebSocket register
        console.log((new Date()) + ': Register');
        // broadcast message to all connected clients
        connection.codeGroup = ""
        
    });
    connection.on('join', function(message) {
        if (message.type === 'utf8') {
            // process WebSocket message
            console.log((new Date()) + ' Received Message ' + message.utf8Data);
            // broadcast message to all connected clients
            clients.forEach(function (outputConnection) {
                if (outputConnection != connection) {
                  outputConnection.send(message.utf8Data, sendCallback);
                }
            });
        }
    });

    
    connection.on('close', function(connection) {
        // close user connection
        console.log((new Date()) + " Peer disconnected.");        
    });
});
