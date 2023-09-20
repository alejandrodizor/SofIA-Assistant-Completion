async function flowSendDashboard(
  id,
  message,
  userSettings,
  sock,
  is_function = false
) {
  try {
    /**
     ** Get Token
     **/
    const token = userSettings.settings.token;

    /**
     ** Create Dashboard Link
     **/

    const dashboardLink = `https://sofia.alejandrodiaz.dev/?token=${token}`;
    const urlPanelImage = "public/images/sofia-dashboard.png";

    /**
     ** Create Dashboard Message
     **/

    const dashboardMessage =
      "*⚙️ Panel de Configuración de SofIA*" +
      "\n\n👉🏻 Puedes cambiar mis configuraciones desde el siguiente link:" +
      "\n\n🔗 " +
      dashboardLink +
      "\n\n💡 No compartas este link con nadie, es exclusivo para ti 🤫";

    /**
     ** Send Dashboard Message
     **/
    await sock.sendMessage(id, {
      image: { url: urlPanelImage},
      mimetype: "image/jpeg",
      caption: dashboardMessage,
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { flowSendDashboard };
