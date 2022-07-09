//-----DEPENDENCIES AND GLOBAL VARIABLES-----------------------------------------
const {filterByQuery, findById, createNewAnimal, validateAnimal} = require('../../lib/animals');
const { animals } = require('../../data/animals.json');
const router = require('express').Router();

//------------ROUTES-------------------------------------
//creates route to GET animal data
//route is the first parameter in the get() function, corresponds to what user needs to add to the / after the domain
//req = request sent by client
//res = response returned by server
router.get('/animals', (req, res) => {
    let results = animals;
    //if request has a query parameter, then run filterByQuery
    if (req.query) {
        //filter by the query params
        results = filterByQuery(req.query, results);
    }
    //return array of animal objects as json
    res.json(results);
});

router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }

});

router.post('/animals', (req, res) => {
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

module.exports = router;