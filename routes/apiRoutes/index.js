//this index.js collects all of the API-related routes into a single file for exporting to server.js

//-----DEPENDENCIES AND GLOBAL VARIABLES-----------------------------------------
const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');
const zookeeperRoutes = require('../apiRoutes/zookeeperRoutes');

//-----MIDDLEWARE-----------------------------------------
router.use(animalRoutes);
router.use(zookeeperRoutes);


module.exports = router;