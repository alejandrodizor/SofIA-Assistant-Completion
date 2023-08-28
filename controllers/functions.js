const functions = [
  {
    name: "clear_chat",
    description: "Limpia el chat de un usuario.",
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
  /*{
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
          description:
            "nombre o numero de la persona a la que se le enviara el mensaje",
        },
      },
    },
  },*/
];

module.exports = { functions };
