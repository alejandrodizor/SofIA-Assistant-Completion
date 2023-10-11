const { Redis } = require("@upstash/redis");
const jwt = require('jsonwebtoken');

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

async function pushMessage(user, message, userSettings) {
  try {
    const settings = userSettings.settings;

    const chatId = settings.currentChat;

    try {
      const chatsData = await getData(`${user}-chats`);

      let jsonData = chatsData.chats;

      // Encuentra el chat en el arreglo de chats utilizando find

      const targetChat = jsonData.find((chat) => chat.id === chatId);

      // Agrega el nuevo mensaje al arreglo de mensajes del chat encontrado

      if (targetChat) {
        if (targetChat.messages.length >= settings.maxMessages) {
          targetChat.messages.shift();

          targetChat.messages.push(message);
        } else {
          targetChat.messages.push(message);
        }
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

/**
 ** Create Token
 *  @param {*} data
 *  @returns
 */
function createToken(data) {
  return jwt.sign(data, process.env.TOKEN_SECRET);
}

// funcion para crear un nuevo usuario
async function newUser(user) {
  try {
    const data = await getData(`${user}-settings`);

    /**
     ** Check if user exists
     **/
    if (data !== null) {
      return { new: false, userSettings: data };
    } else {
      /**
       ** Create Chat
       **/
      const newChats = {
        chats: [
          {
            id: 1,
            messages: [],
          },
        ],
      };

      /**
       ** Token
       **/
       const token = createToken({ user: user });

      /**
       ** Create User Settings
       * */

      const userSettings = {
        settings: {
          token: token,
          name: "",
          birthDate: "",
          interests: [],
          currentChat: 1,
          tutorial: true,
          newUser: true,
          language: "es-CO",
          model: "gpt-3.5-turbo-16k-0613",
          maxTokens: 700,
          typeAnnouncements: "voice",
          announcements: true,
          voiceAnnouncements: true,
          modelImage: "stable-diffusion",
          maxDailyImage: 5,
          maxMessages: 14,
          maxImageRegenerations: 3,
          limitAudioSeconds: 240,
          premium: false,
          expresionTone: "informal", //informal, formal, sarcastic
          invitations: 3,
          voiceAPISettings: {
            provider: "edenai", // elevenlabs, edenai
            speed: 1,
            pitch: 1,
            volume: 1,
            tone: "neutral",
            textToSpeechModel: "EXAVITQu4vr4xnSDxMaL",
            speechStability: 0.75,
            speechSimilarityBoost: 0.75,
          },
          lastImagePrompt: "",
          lastTextPrompt: "",
          history: [
            {
              role: "system",
              content:
                "Eres SofIA una asistente de inteligencia artificial desarrollada por Alejandro Diaz como parte de su investigación sobre IA. Eres muy amable y cálida.",
            },
          ],
          tuning: [
            {
              role: "user",
              content: "Hola Sofia, ¿cómo estás?",
            },
            {
              role: "assistant",
              content:
                "¡Hola! Feliz de que estés aquí. ¿En qué puedo ayudarte?",
            },
          ],
        },
      };

      /**
       ** Save Data
       **/
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
      (item) => item.phone === user.replace(/@s\.whatsapp\.net$/, "")
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

async function clearChat(user, userSettings) {
  try {
    console.log("Clearing chat: " + userSettings);

    const settings = userSettings.settings;

    const chatId = settings.currentChat;

    const chatsData = await getData(`${user}-chats`);
    const chats = chatsData.chats;

    const targetChat = chats.find((chat) => chat.id === chatId);

    targetChat.messages = [];

    return await setData(`${user}-chats`, chatsData);
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function clearAllChats(user) {
  try {
    user.forEach((user) => {
      clearChat(user);
    });

    return true;
  } catch (error) {
    console.log(error);

    return error;
  }
}

async function changeName(id, userSettings, name) {
  try {
    const settingsData = userSettings;
    settingsData.settings.name = name;

    let tuning = [
      {
        role: "user",
        content: `Quiero que de ahora en adelante siempre te refieras a mí como ${name}`,
      },
      {
        role: "assistant",
        content: `¡Claro ${name}! Te llamaré ${name} de ahora en adelante. ¿En qué puedo ayudarte hoy ${name}?`,
      },
    ];

    settingsData.settings.tuning = tuning;

    return await setData(`${id}-settings`, settingsData);
  } catch (error) {
    console.log(error);
  }
}

async function addUserToWhiteList(phone, name = "", refer = "") {
  try {
    const whiteListData = await getData("whiteList");

    const whiteList = whiteListData.whiteList;

    const newId = whiteList.length + 1;

    const newUser = {
      id: newId,
      name: name,
      phone: phone,
      refer: refer,
    };

    whiteList.push(newUser);

    return await setData("whiteList", whiteListData);
  } catch (error) {
    console.log(error);
  }
}

async function deleteUserFromWhiteList(phone) {
  try {
    const whiteListData = await getData("whiteList");

    const whiteList = whiteListData.whiteList;

    const newWhiteList = whiteList.filter((user) => user.phone !== phone);

    return await setData("whiteList", newWhiteList);
  } catch (error) {
    console.log(error);
  }
}

async function getAllUsers() {
  try {
    const keys = await redis.keys("*-settings");

    const users = keys.map((key) => key.split("-")[0]);

    return users;
  } catch (error) {
    console.log(error);

    return error;
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
  clearAllChats,
  clearChat,
  changeName,
  addUserToWhiteList,
  deleteUserFromWhiteList,
  getAllUsers,
};
