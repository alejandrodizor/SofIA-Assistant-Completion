const functions = [
  {
    name: "eliminar_chat",
    description: "Limpia o eliminar el chat o el historial de un usuario.",
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
    name: "crear_imagen",
    description: "Crea o dibuja una imagen a partir de un texto.",
    parameters: {
      type: "object",
      properties: {
        description: {
          type: "string",
          description: "Palabra o frase a dibujar",
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
