//this file collects all of the zookeeper-related API routes into a single file for exporting to index.js

//-----DEPENDENCIES AND GLOBAL VARIABLES-----------------------------------------
const { filterByQuery,
    findById,
    createNewZookeeper,
    validateZookeeper } = require('../../lib/zookeepers');
const { zookeepers } = require('../../data/zookeepers.json');
const router = require('express').Router();

//------------ROUTES-------------------------------------

//creates route to GET zookeeper data
router.get("/zookeepers", (req, res) => {
    let results = zookeepers;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

//Get Zookeeper by ID
router.get("/zookeepers/:id", (req, res) => {
    const result = findById(req.params.id, zookeepers);
    if (result) {
        res.json(result);
    } else {
        res.send(404);   
    }
});

//POST route to add Zookeeper
router.get("/zookeepers", (req,res) => {
    req.body.id = zookeepers.length.toString();

    if (!validateZookeeper(req.body)) {
        res.status(400).send("The zookeeper is not properly formatted.");
    } else {
        const zookeeper = createNewZookeeper(req.body, zookeepers);
        res.json(zookeeper);
    }
});

module.exports = router;