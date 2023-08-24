const { setData } = require("../controllers/db");

const globalSettings = require("./globalSettings.json");

const whiteList = require("./whiteListMain.json");


// Set Global Settings
setData("globalSettings", globalSettings);

// Set White List
setData("whiteList", whiteList);

// Set Bugs
setData("bugs", {
  bugs: [],
});
