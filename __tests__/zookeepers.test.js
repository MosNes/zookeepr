const fs = require('fs');
const {
    filterByQuery,
    findById,
    createNewZookeeper,
    validateZookeeper
} = require("../lib/zookeepers.js");
const { zookeepers } = require("../data/zookeepers.json");

//required so that the fs in createNewAnimal doesn't actually write to our .json file
jest.mock('fs');

test("creates a zookeeper object", () => {
    const zookeeper = createNewZookeeper(
        {name: "Darlene", id: "jhgdja3ng2"},
        zookeepers
    );

    expect(zookeeper.name).toEqual("Darlene");
    expect(zookeeper.id).toEqual("jhgdja3ng2");
});

test("filters by query", () => {
    const startingZookeepers = [
        {
            "id": "0",
            "name": "Kim",
            "age": 28,
            "favoriteAnimal": "dolphin"
          },
          {
            "id": "1",
            "name": "Raksha",
            "age": 31,
            "favoriteAnimal": "penguin"
          }
    ];

    const updatedZookeepers = filterByQuery({ age: 31 }, startingZookeepers);
    console.log(updatedZookeepers);

    expect(updatedZookeepers.length).toEqual(1);
});

test("finds by ID", () => {
    const startingZookeepers = [
        {
            "id": "0",
            "name": "Kim",
            "age": 28,
            "favoriteAnimal": "dolphin"
          },
          {
            "id": "1",
            "name": "Raksha",
            "age": 31,
            "favoriteAnimal": "penguin"
          }
    ];

    const result = findById("1", startingZookeepers);

    expect(result.name).toEqual("Raksha");
});

test("validates age", () => {
    const zookeeper = {
        "id": "0",
        "name": "Kim",
        "age": 28,
        "favoriteAnimal": "dolphin"
      };
    const invalidZookeeper = {
        "id": "1",
        "name": "Raksha",
        "favoriteAnimal": "penguin"
      };
   
    const result = validateZookeeper(zookeeper);
    const result2 = validateZookeeper(invalidZookeeper);

    expect(result).toEqual(true);
    expect(result2).toEqual(false);
});