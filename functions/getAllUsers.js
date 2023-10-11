const { getAllUsers } = require("../controllers/db");

async function getAllUsersList() {
    try {
        const users = await getAllUsers();
        return `👥 Actualmente hay (${users.length}) usuarios:\n\n${users.join("\n")}`;

    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = {getAllUsersList};
