const net = require('net');
const colors = require('colors');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const readMessage = (client) => {
	rl.question("Enter Command: ",  (line) => {
			client.write(line);
			if (line == "bye")  // if input "bye", client disconnect.
				client.end();
			else {
				setTimeout(() => {  // schedules the readMessage function to be executed after a delay of 2 seconds
					readMessage(client);
				}, 2000);
			};
	});
};

const client = net.connect({port:3000},  // creates a client socket and connects to the server running on port 3000
	() => {
		console.log("Connected to server");
		readMessage(client);  // calls the readMessage function to start prompting the user for commands and sending them to the server
	});

client.on('end', () => {  // listens for the 'end' event on the client socket
	console.log("Client disconnected...");
	return;
});

// HW Code - Write code below for 'data' event listener
client.on('data', (data) => {
	const result = JSON.parse(data.toString());  // parse the data to string
	console.log(colors.green('...Received:'));  // print out received message
	console.log(result);  // print out data
  });






















	