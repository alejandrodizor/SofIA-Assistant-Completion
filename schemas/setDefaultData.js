const { setData } = require("../controllers/db");

const globalSettings = require("./globalSettings.json");

// Set Global Settings
setData("globalSettings", globalSettings);

// Set Bugs
setData("bugs", {
  bugs: [],
});
