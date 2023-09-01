const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: "https://us1-guided-jaybird-39219.upstash.io",
  token:
    "AZkzASQgZDdkMzBlN2QtOTUxNy00ZWU4LWE5MDUtYjFhMWU2NzE5M2JhN2NmYzVmMzBhZGYzNDZmMDg4MTkzYzIyYTgyMjY0MTY=",
});

async function setData(key, value) {
  return await redis.set(key, value);
}

async function getData(key) {
  return await redis.get(key);
}

const settings = {
  settings: {
    currentChat: 1,
    name: "",
    language: "es-CO",
    tone: "neutral",
    speed: 1,
    pitch: 1,
    volume: 1,
    announcements: true,
    maxMessages: 10,
    premium: false,
    model: "gpt-3.5-turbo",
    apiTextToSpeech: "edenai",
    textToSpeechModel: "",
    typeAnnouncements: "voice",
    invitations: 5,
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
        content: "¡Hola! Feliz de que estés aquí. ¿En qué puedo ayudarte?",
      },
    ],
  },
};

const globalSettings = {
  settings: {
    admin: "573186312380@c.us",
    production: true,
    beta: true,
    referInvitations: false,
    version: "1.0.0",
    defaultLanguage: "es-CO",
    defaultModel: "gpt-3.5-turbo",
  },
};

const whiteList = {
  whiteList: [
    {
      id: 1,
      name: "Alejandro Diaz",
      phone: "573186312380",
      refer: "",
    },
    {
      id: 2,
      name: "Maria Camila Roldan",
      phone: "573176605393",
      refer: "",
    },
    {
      id: 3,
      name: "Jose David Diaz",
      phone: "573176605393",
      refer: "",
    },
  ],
};

const bugs = {
  bugs: [],
};

const chats = {
  chats: [
    {
      id: 1,
      messages: [
        {
          role: "user",
          content: "Hola, ¿cómo estás?",
        },
        {
          role: "assistant",
          content: "Hola, estoy bien, ¿en qué puedo ayudarte?",
        },
        {
          role: "user",
          content: "Necesito información sobre GPT-4.",
        },
        {
          role: "assistant",
          content:
            "Claro, GPT-4 es una inteligencia artificial desarrollada por OpenAI...",
        },
      ],
    },
    {
      id: 2,
      messages: [
        {
          role: "user",
          content: "¿Cuál es el clima hoy?",
        },
        {
          role: "assistant",
          content:
            "Hoy el clima es soleado con una temperatura de 25 grados Celsius.",
        },
      ],
    },
  ],
};

// funcion para dejar solo los ultimos n mensajes del chat de un usuario
async function setLastMessages(user, n = 20) {
  try {
    const settingsData = await getData(`${user}-settings`);

    const chatId = settingsData.settings.currentChat;

    const chatsData = await getData(`${user}-chats`);
    const chats = chatsData.chats;

    const targetChat = chats.find((chat) => chat.id === chatId);

    const messages = targetChat.messages;

    const lastMessages = messages.slice(-n);

    targetChat.messages = lastMessages;

    chatsData.chats = chats.map((chat) => {
      if (chat.id === chatId) {
        return targetChat;
      } else {
        return chat;
      }
    });

    setData(`${user}-chats`, JSON.stringify(chatsData));
  } catch (error) {
    console.log(error);

    return error;
  }
}

// funcion para obtener todos los usuarios de la base de datos por las -settings y se devuelven en saltos de linea
async function getUsers() {
  try {
    const keys = await redis.keys("*-settings");

    const users = keys.map((key) => key.split("@")[0]);

    return users.join("\n");
  } catch (error) {
    console.log(error);

    return error;
  }
}


// funcion para obtener todos los usuarios de la base de datos por las -settings y se devuelven en un array
async function getUsersArray() {
  try {
    const keys = await redis.keys("*-settings");

    const users = keys.map((key) => key.split("-")[0]);

    return users;
  } catch (error) {
    console.log(error);

    return error;
  }
}

// funcion que llama a la funcion getUsersArray() para obtener los numeros y luego limpia los chats de cada usuario
async function clearAllChats() {
  try {
    const users = await getUsersArray();

    users.forEach((user) => {
      clearChat(user);
    });

    return true;
  } catch (error) {
    console.log(error);

    return error;
  }
}




// setData("globalSettings", globalSettings);
// setData("whiteList", whiteList);
//  setData("573186312380@c.us-settings", settings);
//  newChat("573186312380@c.us");

// clearChat("573186312380@c.us");
// changeChat("573186312380@c.us", 4);

// deleteChat("573186312380@c.us", 1);

// deleteAllChats("573186312380@c.us");

// funcion para obtener el historial del chat, el historial de settings y el tuning del nombre
async function getHistory(user) {
  try {
    const settingsData = await getData(`${user}-settings`);

    const chatId = settingsData.settings.currentChat;

    const chatsData = await getData(`${user}-chats`);
    const chats = chatsData.chats;

    const targetChat = chats.find((chat) => chat.id === chatId);

    const historyData = settingsData.settings.history.concat(
      settingsData.settings.tuning
    );

    return historyData.concat(targetChat.messages);
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

// funcion para obtener los globalSettings
async function getGlobalSettings() {
  try {
    const globalSettingsData = await getData("globalSettings");

    return globalSettingsData.settings;
  } catch (error) {
    console.log(error);
  }
}

// function para agregar un usuario a la whiteList
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

//funcion para cambiar de modelo en los settings
async function changeGPTModel(user, model) {
  try {
    const settingsData = await getData(`${user}-settings`);
    const settings = settingsData.settings;

    settings.model = model;

    return await setData(`${user}-settings`, settingsData);
  } catch (error) {
    console.log(error);
  }
}

// funcion para obtener las settings
async function getSettings(user) {
  try {
    const settingsData = await getData(`${user}-settings`);

    return settingsData;
  } catch (error) {
    console.log(error);
  }
}

// funcion para agregar un nuevo bug, debe recibir el usuario y la descripcion del bug

//addBug("573186312380@c.us", "esto es un bug").then((data) => console.log(data));

async function addBug(user, description) {
  try {
    const bugsData = await getData("bugs");

    let jsonData = bugsData.bugs;

    const newBugId =
      jsonData.reduce((maxId, bug) => Math.max(maxId, bug.id), 0) + 1;

    const newBug = {
      id: newBugId,
      user: user,
      description: description,
      status: "open",
      priority: "high",
    };

    jsonData.push(newBug);

    bugsData.bugs = jsonData;

    return await setData("bugs", bugsData);
  } catch (error) {
    console.log(error);
  }
}

// Crea una funcion que limpie el chat
async function clearChat(user) {
  try {
    const settingsData = await getData(`${user}-settings`);
    const settings = settingsData.settings;

    const chatId = settings.currentChat;

    const chatsData = await getData(`${user}-chats`);
    const chats = chatsData.chats;

    const targetChat = chats.find((chat) => chat.id === chatId);

    targetChat.messages = [];

    return await setData(`${user}-chats`, chatsData);
  } catch (error) {
    console.log(error);
  }
}

async function newChat(user) {
  try {
    const chatsData = await getData(`${user}-chats`);

    let jsonData = chatsData.chats;

    const newChatId =
      jsonData.reduce((maxId, chat) => Math.max(maxId, chat.id), 0) + 1;

    const newChat = {
      id: newChatId,
      messages: [],
    };

    // Agrega el nuevo chat al arreglo de chats
    jsonData.push(newChat);

    setData(`${user}-chats`, { chats: jsonData });

    try {
      const settingsData = await getData(`${user}-settings`);
      // No es necesario utilizar JSON.parse()
      // const jsonObject = JSON.parse(settingsData);

      settingsData.settings.currentChat = newChatId;

      return await setData(`${user}-settings`, settingsData);
    } catch (error) {
      console.log(error);
    }
  } catch (err) {
    console.log(err);
  }
}

async function pushMessageNoValidate(user, message) {
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

//funcion que hace un push de un mensaje pero valida si ya hay más de 20 mensajes, si es así, elimina el primer mensaje y agrega el nuevo
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
        if (targetChat.messages.length >= 20) {
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




// crea una funcion que cambie el chat actual
async function changeChat(user, chatId) {
  try {
    const settingsData = await getData(`${user}-settings`);
    // No es necesario utilizar JSON.parse()
    // const jsonObject = JSON.parse(settingsData);

    settingsData.settings.currentChat = chatId;

    return await setData(`${user}-settings`, settingsData);
  } catch (error) {
    console.log(error);
  }
}

// funcion para eliminar un chat, si es el chat actual, cambia al chat anterior, si no hay chat anterior, solo limpia el chat actual
async function deleteChat(user, chatId) {
  try {
    const settingsData = await getData(`${user}-settings`);

    const currentChatId = settingsData.settings.currentChat;

    const chatsData = await getData(`${user}-chats`);
    const chats = chatsData.chats;

    const targetChat = chats.find((chat) => chat.id === chatId);
    let newChats;

    if (targetChat) {
      if (currentChatId === chatId) {
        const previousChat = chats.find((chat) => chat.id === chatId - 1);

        if (previousChat) {
          settingsData.settings.currentChat = previousChat.id;
          newChats = chats.filter((chat) => chat.id !== chatId);
        } else {
          settingsData.settings.currentChat = 1;

          if (chats.length > 1) {
            return await clearChat(user);
          } else {
            newChats = {
              chats: [
                {
                  id: 1,
                  messages: [],
                },
              ],
            };
          }
        }
      }

      await setData(`${user}-settings`, settingsData);

      return await setData(`${user}-chats`, { chats: newChats });
    } else {
      console.log(`No se encontró el chat con id ${chatId}`);
    }
  } catch (error) {
    console.log(error);
  }
}

// Funcion para borrar todos los chats
async function deleteAllChats(user) {
  try {
    const settingsData = await getData(`${user}-settings`);
    settingsData.settings.currentChat = 1;
    let newChats = {
      chats: [
        {
          id: 1,
          messages: [],
        },
      ],
    };
    await setData(`${user}-settings`, settingsData);
    return await setData(`${user}-chats`, newChats);
  } catch (error) {
    console.log(error);
  }
}

// Funcion para obtener los datos de un usuario
async function getDataUser(user) {
  try {
    const data = await getData(`${user}-data`);
    return data;
  } catch (error) {
    console.log(error);
  }
}

// newUser("5731867@c.us");

// funcion para crear un nuevo usuario
async function newUser(user) {
  try {
    const data = await getData(`${user}-settings`);

    if (data !== null) {
      return { new: false, settings: data };
    } else {
      let newChats = {
        chats: [
          {
            id: 1,
            messages: [],
          },
        ],
      };

      await setData(`${user}-chats`, newChats);
      await setData(`${user}-settings`, settings);

      console.log("Usuario creado");

      return { isNewUser: true, settings };
    }
  } catch (error) {
    console.log(error);
  }
}

// funcion para cambiar el name en las settings de un usuario
async function changeName(user, name) {
  try {
    const settingsData = await getData(`${user}-settings`);
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

    return await setData(`${user}-settings`, settingsData);
  } catch (error) {
    console.log(error);
  }
}

// funcion para cambiar el lenguaje de las settings de un usuario
async function changeLanguage(user, language) {
  try {
    const settingsData = await getData(`${user}-settings`);
    settingsData.settings.language = language;

    return await setData(`${user}-settings`, settingsData);
  } catch (error) {
    console.log(error);
  }
}

//isUserInWhiteList("573186312380@c.us").then((res) => console.log(res));
// funcion para evaluar si un usuario está en la whitelist

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

// loadUsersFromWhiteList().then((res) => console.log(res));

async function loadUsersFromWhiteList() {
  try {
    const whiteListJSON = require("./models/whiteList.json");
    return setData("whiteList", whiteListJSON);
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  setData,
  getData,
  pushMessage,
  newChat,
  clearChat,
  changeChat,
  deleteChat,
  deleteAllChats,
  getHistory,
  getSettings,
  getDataUser,
  newUser,
  changeName,
  changeLanguage,
  getLastMessages,
  changeGPTModel,
  addUserToWhiteList,
  getGlobalSettings,
  isUserInWhiteList,
  addBug,
  getUsers,
  setLastMessages,
  clearAllChats
};
