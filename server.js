//ternary operator (expression) ? (if expression is true do this) : (if expression is false do this);

//use npm install nodemon, will restart server each time you change the code
//'npm install nodemon', then run with 'nodemon server.js'

//-----DEPENDENCIES AND GLOBAL VARIABLES-----------------------------------------

const express = require('express');
const fs = require('fs');
const path = require('path');

//gets json object of all animal data
const { animals } = require('./data/animals.json');

const PORT = process.env.PORT || 3001;

//creates instance of an express server
//invoked by `npm start` in terminal
// use Ctrl+C to end the server
const app = express();

//-----REQUIRED MIDDLEWARE-------------------------------------------------------

//both of these are required to receive and interpret POST requests
//parse incoming string or array
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON data
app.use(express.json());

//required to serve static assets like front-end js and CSS
//makes the whole 'public' folder available
//otherwise would need to create endpoints for each js and css file for each page
app.use(express.static('public'));

//------FUNCTIONS----------------------------------------------------------------

function filterByQuery(query, animalsArray) {
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

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

//creates an animal object, adds it to animalsArray and then writes that array to a JSON file
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    return animal;
}

//data validation for creating new animals
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name != 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species != 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet != 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

//------------ROUTES-------------------------------------

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
});

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }

});

app.post('/api/animals', (req, res) => {
    //req.body is where our incoming content resides
    //set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    //if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.')
    } else {
        //add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);

        res.json(animal);
    }
});

//serves the index.html file when no route is presented by client
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//serves the animals.html file
app.get('/animals', (req,res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'))
});

//serves the zookeeper.html file
app.get('/zookeepers', (req,res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'))
});

//serves the index.html file if the user specifies an endpoint that doesn't exist
//'wildcard' route must be placed after all other routes so that it doesn't conflict with the predefined routes
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

//starts listening for requests on port 3001
//if called on a local PC, starts the server on http://localhost:PORT/
app.listen(PORT, () => {
    console.log(`API Server now listening on port ${PORT}!`);
});
