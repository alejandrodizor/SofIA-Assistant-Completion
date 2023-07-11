const { Redis } = require("@upstash/redis");
const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

async function setData(key, value) {
  return await redis.set(key, value);
}

async function getData(key) {
  return await redis.get(key);
}


async function pushMessage(user, message) {
    try {
      const settingsData = await getData(`${user}-settings`);
      const settings = settingsData.settings;
  
      const chatId = settings.currentChat;
  
      try {
        const chatsData = await getData(`${user}-chats`);
  
        let jsonData = chatsData.chats;
  
        // Encuentra el chat en el arreglo de chats utilizando find
  
        const targetChat = jsonData.find((chat) => chat.id === chatId);
  
        // Agrega el nuevo mensaje al arreglo de mensajes del chat encontrado
        if (targetChat) {
          targetChat.messages.push(message);
        } else {
          console.log(`No se encontró el chat con id ${chatId}`);
        }
  
        return await setData(`${user}-chats`, { chats: jsonData });
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  }


// funcion para crear un nuevo usuario
async function newUser(user) {
  try {
    const data = await getData(`${user}-settings`);

    if (data !== null) {
      return { new: false, userSettings: data };
    } else {
      let newChats = {
        chats: [
          {
            id: 1,
            messages: [],
          },
        ],
      };

      const userSettings = require("../schemas/userSettings.json");

      await setData(`${user}-chats`, newChats);
      await setData(`${user}-settings`, userSettings);

      console.log("User created");

      return { isNewUser: true, userSettings };
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function isUserInWhiteList(user) {
  try {
    const data = await getData("whiteList");

    const isPhoneNumberInList = data.whiteList.some(
      (item) => item.phone === user.replace(/@c\.us$/, "")
    );

    if (isPhoneNumberInList) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getGlobalSettings() {
  try {
    const globalSettingsData = await getData("globalSettings");

    return globalSettingsData.settings;
  } catch (error) {
    console.log(error);
  }
}

async function getLastMessages(user) {
  try {
    const settingsData = await getData(`${user}-settings`);

    const chatId = settingsData.settings.currentChat;
    const maxMessages = settingsData.settings.maxMessages;

    const chatsData = await getData(`${user}-chats`);
    const chats = chatsData.chats;

    const targetChat = chats.find((chat) => chat.id === chatId);

    const historyData = settingsData.settings.history.concat(
      settingsData.settings.tuning
    );

    const messages = targetChat.messages;

    const lastMessages = messages.slice(-maxMessages);

    return historyData.concat(lastMessages);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  setData,
  getData,
  getGlobalSettings,
  newUser,
  isUserInWhiteList,
  getLastMessages,
  pushMessage,
};