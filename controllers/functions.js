const functions = [
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
              description: "nombre o numero de la persona a la que se le enviara el mensaje",
            },
          },
        },
      },*/
]

module.exports = { functions }