const net = require('net');
const colors = require('colors');
const zipCodeModule = require('./zipCodeModule_v2');

const server = net.createServer((socket) => {

	console.log("Client connection...".red);

	socket.on('end', () => {  // event listener for the 'end' event 
		console.log("Client disconnected...".red);
	});

	// HW Code - Write the following code to process data from client
	
	socket.on('data', (data) => {  // event listener for the 'data' event 

		if(data){
			let input = data.toString();  // converts the received data into a string by calling the toString()
			console.log(colors.blue('...Received %s'), input);
	
			// Splits the input string into an array using the ','
			// First element of the array is assigned to the command variable
			// The rest of the elements are collected into the args array
			const [command, ...args] = input.split(',');
			let result = null;  // initializes the result variable to null
		
			// Checks the value of the command variable 
			// to determine which command was received from the client
			if (command === 'lookupByZipCode') {
			  result = zipCodeModule.lookupByZipCode(args[0]);  // args[0] as the zip code parameter
			  if (!result) {
				result = 'Zip code not found';
			  }
			} else if (command === 'lookupByCityState') {
			  result = zipCodeModule.lookupByCityState(args[0], args[1]);  // args[0] as the city, args[1] as the state parameter
			} else if (command === 'getPopulationByState') {
			  result = zipCodeModule.getPopulationByState(args[0]);  // args[0] as the state parameter
			} else {
			  result = 'Invalid Request';
			}
		
			socket.write(JSON.stringify(result));  // sends the result back to the client as a JSON string
	
		}



		
	});

});

// listen for client connections
server.listen(3000, () => {
	console.log("Listening for connections on port 3000");
});
