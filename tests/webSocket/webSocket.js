let { WombatServer, Route } = require('../../index.js');
WombatServer.withoutDatabase().setUnsecure().setRoutes([
	Route.get('/', require('../putRequest/controllers/PutRequestController/PutRequestController.js')),
	Route.websocket('/', require('./controllers/WebSocketTestController/WebSocketTestController.js'))
]).init((port)=>{
	let WebSocketClient = require('websocket').client,
		ws = new WebSocketClient();
	ws.on('connectFailed', (error) => {
		console.log(error);
		process.exit();
	});
	ws.on('connect', (connection) => {
		connection.on('message', (message) => {
			console.log("Server => Client: " + message.utf8Data);
		});
		connection.on('close', () => {
			console.log('Client: connection closed!');
			process.exit();
		});
		console.log("Connection connected!");
		setInterval(() => {
			connection.send('foo');
		}, 1000);
		setInterval(() => {
			connection.ping();
		}, 10000);
		setTimeout(() => {
			connection.close();
		}, 30000);
	});
	ws.connect('ws://localhost:' + port);
	let ws2 = new WebSocketClient();
	ws2.on('connectFailed', (error) => {
		console.log(error);
		process.exit();
	});
	ws2.on('connect', (connection) => {
		connection.on('message', (message) => {
			console.log("Server => Client 2: " + message.utf8Data);
		});
		setTimeout(() => {
			connection.close();
		}, 5000);
	});
	ws2.connect('ws://localhost:' + port);
});