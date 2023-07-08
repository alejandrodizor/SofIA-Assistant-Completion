const wppconnect = require("@wppconnect-team/wppconnect");
const { flow } = require("./controllers/flow");

wppconnect
  .create({
    session: "sofIA-v4",
    statusFind: (statusSession, session) => {
      console.log("Status Session: ", statusSession);
      console.log("Session name: ", session);
    },
  })
  .then((client) => flow(client))
  .catch((error) => console.log(error));

