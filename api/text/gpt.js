const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

const { Configuration, OpenAIApi } = require("openai");
const { worker } = require("../../controllers/function-worker");
const { functions } = require("../../controllers/functions");
const { getLastMessages, pushMessage } = require("../../controllers/db");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function chatGPT(message, user, settings, client) {
  try {
    const model = settings.settings.model;
    const max_tokens = settings.settings.maxTokens;
    let history = await getLastMessages(user);

    history.push({ role: "user", content: message });
    pushMessage(user, { role: "user", content: message });

    const response = await openai.createChatCompletion({
      model: model,
      messages: history,
      max_tokens: max_tokens,
      functions: functions,
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

      let function_response = "Se ha enviado correctamente el mensaje.";

      history.push({
        role: "function",
        name: function_name,
        content: function_response,
      });

      pushMessage(user, {
        role: "function",
        content: function_response,
        name: function_name,
      });

      const second_response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-0613",
        messages: history,
      });

      let second_response_message =
        second_response["data"]["choices"][0]["message"];

      pushMessage(user, {
        role: "assistant",
        content: second_response_message.content,
      });

      return {
        is_function: false,
        function_name: null,
        arguments: null,
        message: second_response_message.content,
      };
    } else {
      pushMessage(user, {
        role: "assistant",
        content: response_message.content,
      });
      return {
        is_function: false,
        function_name: null,
        arguments: null,
        message: response_message.content,
      };
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = { chatGPT };
