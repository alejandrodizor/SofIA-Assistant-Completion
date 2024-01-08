const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

//const { Configuration, OpenAIApi } = require("openai");

const OpenAI = require("openai");


const { worker } = require("../../controllers/function-worker");
const { functions } = require("../../controllers/functions");
const { getLastMessages, pushMessage } = require("../../controllers/db");

/**
 ** Configuration: OpenAI
 */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


async function chatGPT(id, message, settings, sock) {
  try {
    const model = settings.settings.model;
    const max_tokens = settings.settings.maxTokens;
    let history = await getLastMessages(id);

    /**
     ** Push Message
     */

    history.push({ role: "user", content: message });

    /**
     ** OpenAI: Create Chat Completion
     */


  


    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: history,
      max_tokens: max_tokens,
      functions: functions,
    });


    let response_message = response.choices[0].message;

    if (response_message.length < 1) {
      return false;
    } else {
      /**
       ** Push Message
       */
      await pushMessage(id, { role: "user", content: message }, settings);
    }

    if (
      response_message.hasOwnProperty("function_call") &&
      response_message.function_call !== null
    ) {
      let function_name = response_message.function_call.name;
      let arguments = JSON.parse(response_message.function_call.arguments);

      /**
       ** Function: Execute Function
       */
      let function_response = await worker(
        id,
        message,
        settings,
        function_name,
        arguments,
        sock
      );

      if (!function_response.success) {
        function_response.response = "Hubo un error al ejecutar la función";
        console.log(
          "Hubo un error al ejecutar la función",
          function_response.response
        );
      }

      console.log("function_response", function_response);

      /**
       ** Push Message
       */

      history.push({
        role: "function",
        name: function_name,
        content: function_response.response,
      });

      pushMessage(
        id,
        {
          role: "function",
          content: function_response.response,
          name: function_name,
        },
        settings
      );

      if (function_response.saveMessage && function_response.response) {
        /**
         ** Push Message
         */
        await pushMessage(
          id,
          {
            role: "assistant",
            content: function_response.response,
          },
          settings
        );
      }

      if (!function_response.showMessage) {
        return {
          is_function: true,
          function_name: null,
          arguments: null,
          message: function_response.response,
          showMessage: false,
        };
      }

      const second_response =  await openai.chat.completions.create({
        model: model,
        messages: history,
      });

      let second_response_message = second_response.choices[0].message;

      return {
        is_function: false,
        function_name: null,
        arguments: null,
        message: second_response_message.content,
        showMessage: true,
      };
    } else {
      if (response_message.content) {
        /**
         ** Push Message
         */
        pushMessage(
          id,
          {
            role: "assistant",
            content: response_message.content,
          },
          settings
        );
      }

      return {
        is_function: false,
        function_name: null,
        arguments: null,
        message: response_message.content,
        showMessage: true,
      };
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = { chatGPT };
