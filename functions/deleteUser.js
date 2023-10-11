const { deleteUserFromWhiteList } = require("../controllers/db");

async function deleteUser(message) {
    try {
        const number = message.split(" ")[1];
    
        if(!number) return "❌ Debes ingresar el número del usuario";
    
        const response = await deleteUserFromWhiteList(number);
    
        if (response) {
        return `✅ Usuario eliminado correctamente con el número ${number}`;
        } else {
        return `❌ No se pudo eliminar el usuario con el número ${number}`;
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = { deleteUser };