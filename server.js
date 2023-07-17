const express = require('express');
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// setup handlebars view engine
const handlebars = require('express-handlebars');

app.engine('handlebars', 
	handlebars({defaultLayout: 'main'}));  // views/layouts/main.handlebars

app.set('view engine', 'handlebars');

// static resources
app.use(express.static(__dirname + '/public')); 

// Use the zipCode module
const cities = require('./zipCodeModule_v2');

// GET request to the homepage
app.get('/',  (req, res) => {
	res.render('homeView');
});

app.get('/zip', (req, res) => {
	const id = req.query.id;
	if (id) {
		// Lookup the corresponding data by zip code
		const result = cities.lookupByZipCode(id);
		res.render('lookupByZipView', { data: result });
		console.log(result);
	} else {
		// If the id parameter is not provided, it renders the 'lookupByZipForm' view
		// Render the lookupByZipForm
		res.render('lookupByZipForm');
	}
});
      

app.post('/zip', (req, res) => {
	const id = req.body.id;  // retrieves the zip code from the request body
	const result = cities.lookupByZipCode(id);
	res.render('lookupByZipView', { data: result });  // renders the 'lookupByZipView' view with the resulting data
});
  
// Implement the JSON, XML, & HTML formats

app.get('/zip/:id', (req, res) => {
	const id = req.params.id;
	const result = cities.lookupByZipCode(id);

	// handle different response formats based on the 'Accept' header in the request
	res.format({

		// responds with the result as JSON
		'application/json': () => {
			res.json(result);
		},

		// generates an XML string using the result data and sends it as the response
		'application/xml': () => {
			let Xmldata = 
				'<?xml version="1.0"?>\n<zipCode id=\"' +
				result._id+ '\">\n' + 
				'  <city>' + result.city + '</city>\n' + 
				'  <state>' + result.state + '</state>\n' + 
				'  <pop>' + result.pop + '</pop>\n' + 
				'</zipCode>\n';
			
			res.type('application/xml');
			res.send(Xmldata);
		},

		// renders the 'lookupByZipView' view with the result data passed as an object
		'text/html': () => {
			res.render('lookupByZipView', { data: result });
		},

		// for any other format, it sends a 404 response with the message "404 - Not Found"
		'default': () => {
			res.status(404);
			res.send("<b>404 - Not Found</b>");
		}
	});
});

app.get('/city', (req, res) => {
	const city = req.query.city;
	const state = req.query.state;

	if (city && state) {
		const result = cities.lookupByCityState(city, state);
		console.log(result);
		// Result is rendered using the 'lookupByCityStateView' view, 
		// and the city, state, and data are passed as variables to the view template.
		res.render('lookupByCityStateView', { city, state, data: result });
	} else {
		// If either the city or state value is missing, it renders the 'lookupByCityStateForm' view, 
		// which displays a form to enter the city and state values.
		res.render('lookupByCityStateForm');
	}
});
// POST request to the '/city' route. It retrieves the city and state values from the request body 
// using req.body.city and req.body.state respectively.
app.post('/city', (req, res) => {
	const city = req.body.city;
	const state = req.body.state;
	const result = cities.lookupByCityState(city, state);
	res.render('lookupByCityStateView', { city, state, data: result });
});

// Implement the JSON, XML, & HTML formats

app.get('/city/:city/state/:state', (req, res) => {
	const city = req.params.city;
	const state = req.params.state;
	const result = cities.lookupByCityState(city, state);
	
	// handle different response formats based on the 'Accept' header in the request
	res.format({

		// responds with the result as JSON
		'application/json': () => {
			res.json(result);
		},
		
		// generates an XML string using the result data and sends it as the response
		'application/xml': () => {
			let Xmldata = 
			'<?xml version="1.0"?>\n<city-state city=\"' +
			result.city+ '\" state=\"' + result.state + '\">\n' + 

					result.data.map(function(c){
						return '  <entry zip="' + c._id + ' pop="' + c.pop + '" />';
					}).join('\n') + 
			
			'\n</city-state>\n';
			
			res.type('application/xml');
			res.send(Xmldata);
		},

		// renders the 'lookupByZipView' view with the result data passed as an object
		'text/html': () => {
			res.render('lookupByCityStateView', { city, state, data: result });
		},

		// for any other format, it sends a 404 response with the message "404 - Not Found"
		'default': () => {
			res.status(404);
			res.send("<b>404 - Not Found</b>");
		}
	});
});


app.get('/pop', (req, res) => {
	const state = req.query.state;
  
	if (state) {

		const result = cities.getPopulationByState(state);  // retrieves the population data for that state 
		res.render('populationView', { state, data: result });  // The state and data variables are passed to the view template for rendering
	} else {
		// If the state parameter is not present, it renders the 'populationForm' view template.
		res.render('populationForm');
	}
  });
  

  
app.get('/pop/:state', (req, res) => {
	const state = req.params.state;
	const result = cities.getPopulationByState(state);

    // handle different response formats based on the 'Accept' header in the request
	res.format({

		// responds with the result as JSON
		'application/json': () => {
			res.json(cities.getPopulationByState(state));
		},
		// generates an XML string using the result data and sends it as the response
		'application/xml': () => {
			let Xmldata = 
				'<?xml version="1.0"?>\n<state-pop state=\"' +
				cities.getPopulationByState(state).state+ '\">\n' + 
				'  <pop>' + cities.getPopulationByState(state).pop + '</pop>' + 
				'\n</state-pop>\n';
			
			res.type('application/xml');
			res.send(Xmldata);
		},

		// renders the 'lookupByZipView' view with the result data passed as an object
		'text/html': () => {
			res.render('populationView', { state, data: result });
		},

		// for any other format, it sends a 404 response with the message "404 - Not Found"
		'default': () => {
			res.status(404);
			res.send("<b>404 - Not Found</b>");
		}
	});
});

app.use((req, res) => {
	res.status(404);
	res.render('404');
});

app.listen(3000, () => {
  console.log('http://localhost:3000');
});




