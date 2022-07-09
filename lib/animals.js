const fs = require("fs");
const path = require("path");

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
        path.join(__dirname, '../data/animals.json'),
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

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};