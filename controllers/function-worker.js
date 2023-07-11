const ext = "@c.us";

async function worker(function_name, args, client) {
  console.log("worker", function_name, args);

  if (function_name === "enviar_mensaje") {
    let response = await send_message(args.mensaje, args.destinatario, client);
    console.log("response", response)
    return response;
  }
}

// funcion que envia un mensaje a un chat
 async function send_message(mensaje, destinatario, client) {

  if (destinatario === undefined || destinatario === "") {
    destinatario = "esposa";
  }

  let phone = destinatario.toLowerCase();

  if (
    destinatario === "esposa" ||
    destinatario === "mujer" ||
    destinatario === "camila" ||
    destinatario === "señora"
  ) {
    phone = "573176605393";

    client
      .sendText(`${phone}${ext}`, mensaje)
      .then(() => {
        
      })
      .catch((error) => {
        console.error("Error when sending: ", error);
        return "Error al enviar el mensaje";
      });
  }

  return "Mensaje enviado correctamente";

  
}

module.exports = { worker };
