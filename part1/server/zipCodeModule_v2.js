// Copy your solution from Assignment1


let data = require('./zips.json');

module.exports.lookupByZipCode =  (zip) => {
	let found = data.find(function (element) {
        return element._id === zip;
    });
    return found;
         
};

module.exports.lookupByCityState = (city, state) => {
    let match = data.filter((element) => element.city === city && element.state === state);
    return { city, state, data: match.map(({ _id, pop }) => ({ _id, pop })) };
  };
  

  module.exports.getPopulationByState = (state) => {
    const result = data.reduce((acc, element) => {
      if (element.state === state) {
        acc += element.pop;
      }
      return acc;
    }, 0);
    
    return { state, pop: result };
  };
  