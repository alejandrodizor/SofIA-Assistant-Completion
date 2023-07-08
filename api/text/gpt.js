const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve(process.cwd(), "../.env");
dotenv.config({ path: envPath });

const { Configuration, OpenAIApi } = require("openai");
const { worker } = require("../../controllers/function-worker");
//const { getLastMessages, pushMessage } = require("../utils/database");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function chatGPT(message, client) {
  try {
    // const model = settings.settings.model;
    //const max_tokens = settings.settings.maxTokens;
    //let history = await getLastMessages(user);
    let history = [
      {
        role: "system",
        content:
          "Newton es una inteligencia artificial creada por Alejandro Diaz para ayudarlo en todas sus labores diarias como ingeniero des sistemas y desarrollador.",
      },
    ];

    history.push({ role: "user", content: "¡Hola Newton!" });
    history.push({
      role: "assistant",
      content: "Hola Señor, ¿en qué puedo ayudarlo hoy?",
    });
    history.push({ role: "user", content: message });
    // pushMessage(user, { role: "user", content: message });

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages: history,
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0,
      functions: [
        {
          name: "limpiar_historial",
          description: "Limpia el historial de un chat.",
          parameters: {
            type: "object",
            properties: {
              chat: {
                type: "number",
                description: "numero del chat a limpiar",
              },
            },
          },
        },
        {
          name: "enviar_mensaje",
          description: "Envia un mensaje a un chat.",
          parameters: {
            type: "object",
            properties: {
              mensaje: {
                type: "string",
                description: "mensaje a enviar",
              },
              destinatario: {
                type: "string",
                description: "nombre o numero de la persona a la que se le enviara el mensaje",
              },
            },
          },
        },
      ],
    });

    let response_message = response["data"]["choices"][0]["message"];

    if (
      response_message.hasOwnProperty("function_call") &&
      response_message.function_call !== null
    ) {
      let function_name = response_message.function_call.name;
      let arguments = JSON.parse(response_message.function_call.arguments);

      // execute function
      worker(function_name, arguments, client);

      let function_response =
        "Se ha enviado correctamenete el mensaje.";

      history.push({
        role: "function",
        name: function_name,
        content: function_response,
      });

      // pushMessage(user, { role: "user", content: messa

      console.log("history", history);
      const second_response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-0613",
        messages: history,
      });

      let second_response_message =
        second_response["data"]["choices"][0]["message"];

      return {
        is_function: false,
        function_name: null,
        arguments: null,
        message: second_response_message.content,
      };
    } else {
      return {
        is_function: false,
        function_name: null,
        arguments: null,
        message: response_message.content,
      };
    }

    //pushMessage(user, { role: "assistant", content: ChatGPTreply });
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = { chatGPT };
