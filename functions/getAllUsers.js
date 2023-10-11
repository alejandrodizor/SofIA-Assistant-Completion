const { getAllUsers } = require("../controllers/db");

async function getAllUsersList() {
    try {
        const users = await getAllUsers();
        return `La lista de usuarios es (${users.length}):\n${users.join("\n")}`;

    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = {getAllUsersList};
