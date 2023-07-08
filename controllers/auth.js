const { getGlobalSettings, isUserInWhiteList, newUser } = require("./db");

let response = {
  success: false,
  message: "Error",
  userSettings: null,
  isNewUser: false,
};

async function authentication(ctx) {
  try {
    /**
     ** Global Settings
     */

    const globalSettings = await getGlobalSettings();

    /**
     ** Production validation
     */

    if (!globalSettings.production) {
      response.success = false;
      response.message = "😴 Disculpa, en estos momentos no estoy en línea 🔧";
      return response;
    }

    /**
     ** Whitelist validation
     * TODO: Change message
     */

    const isInWhiteList = await isUserInWhiteList(ctx.from);

    if (!isInWhiteList) {
      response.success = false;
      response.message =
        "Lo siento 😓, actualmente solo me encuetro disponible por medio de invitación ✉️.";
      return response;
    }

    /**
     ** Initialize user
     * TODO: Add to list of active users
     */

    const { isNewUser, userSettings } = await newUser(ctx.from);

    if (isNewUser) {
      response.isNewUser = true;
    }

    /**
     ** Return response
     */

    response.success = true;
    response.message = "Success";
    response.userSettings = userSettings;

    return response;
  } catch (error) {
    /**
     ** Catch error
     */
    response.success = false;
    response.message = error;
    console.log(error);

    return response;
  }
}

module.exports = authentication;
