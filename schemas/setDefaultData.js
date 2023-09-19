const { setData } = require("../controllers/db");

const globalSettings = require("./globalSettings.json");

const whiteList = require("./whiteList.json");


// Set Global Settings
setData("globalSettings", globalSettings);

// Set White List
setData("whiteList", whiteList);

// Set Bugs
setData("bugs", {
  bugs: [],
});
