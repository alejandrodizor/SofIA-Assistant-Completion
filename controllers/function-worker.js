const ext = "@c.us";

function worker(function_name, args, client) {
  console.log("worker", function_name, args);

  if (function_name === "enviar_mensaje") {
    send_message(args.mensaje, args.destinatario, client);
  }
}

// funcion que envia un mensaje a un chat
function send_message(mensaje, destinatario, client) {
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
      .then((result) => {
        //return object success
      })
      .catch((error) => {
        console.error("Error when sending: ", error); //return object error
      });
  }
}

module.exports = { worker };
