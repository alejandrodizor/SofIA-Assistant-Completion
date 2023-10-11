const { addNewUser } = require("../../functions/addNewUser");
const { deleteUser } = require("../../functions/deleteUser");
const { getAllUsersList } = require("../../functions/getAllUsers");

async function flowAdmin(id, message, isAdmin, sock) {
  /**
   ** Validate Admin
   **/
  if (!isAdmin) {
    return await sock.sendMessage(id, {
      text: "🖐️ No tienes permisos de administrador.",
    });
  }

  /**
   * @add
   */
  if (message.startsWith("@add")) {
    const response = await addNewUser(message);
    return await sock.sendMessage(id, { text: response });
  }

  /**
   * @remove
   */
  if (message.startsWith("@remove")) {
    const response = await deleteUser(message);
    return await sock.sendMessage(id, { text: response });
  }

  /**
   * @users
   **/
  if (message.startsWith("@users")) {
    const response = await getAllUsersList();
    return await sock.sendMessage(id, { text: response });
  }
}

module.exports = { flowAdmin };
