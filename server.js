//Dependencies and global variables
const express = require('express');
//gets json object of all animal data
const { animals } = require('./data/animals.json');

const PORT = process.env.PORT || 3001;

//creates instance of an express server
//invoked by `npm start` in terminal
// use Ctrl+C to end the server
const app = express();

function filterByQuery (query, animalsArray) {
    //creates an empty array for personality traits
    let personalityTraitsArray = [];
    //creates new array from animalsArray to be manipulated by filters without modifying the original
    let filteredResults = animalsArray;

    if (query.personalityTraits) {
        //save personality traits as a dedicated array.
        //If personality traits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            //check the trait against each animal in the filterResults array.
            //remember, it is initially a copy of the animalsArray, but here
            //we're updating it for each trait in the  .forEach() loop.
            //For each trait being targeted by the filter, the filteredResults
            //array will then only contain entries that contain the trait.
            //so at the end we'll have an array of animals that have every one of the traits
            // when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1);
        });
    }

    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

//creates route to GET animal data
//route is the first parameter in the get() function, corresponds to what user needs to add to the / after the domain
//req = request sent by client
//res = response returned by server
app.get('/api/animals', (req, res) => {
    let results = animals;
    //if request has a query parameter, then run filterByQuery
    if (req.query) {
        //filter by the query params
        results = filterByQuery(req.query, results);
    }
    //return array of animal objects as json
    res.json(results);
})

//starts listening for requests on port 3001
//if called on a local PC, starts the server on http://localhost:PORT/
app.listen(PORT, () => {
    console.log(`API Server now listening on port ${PORT}!`);
});
