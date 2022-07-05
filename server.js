//Dependencies and global variables
const express = require('express');
//gets json object of all animal data
const { animals } = require('./data/animals.json');

//creates instance of an express server
//invoked by `npm start` in terminal
// use Ctrl+C to end the server
const app = express();

//creates route to GET animal data
//route is the first parameter in the get() function, corresponds to what user needs to add to the / after the domain
//req = request sent by client
//res = response returned by server
app.get('/api/animals', (req, res) => {
    res.json(animals);
})

//starts listening for requests on port 3001
//if called on a local PC, starts the server on http://localhost:PORT/
app.listen(3001, () => {
    console.log(`API Server now on port 3001!`);
});
