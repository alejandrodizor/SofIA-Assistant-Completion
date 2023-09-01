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
      required: ["description"],
    },
  },
  {
    name: "recordar_nombre",
    description:
      "Cada vez que el usuario dice su nombre, se recuerda el nombre del usuario para llamarlo por su nombre",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description:
            "Nombre del usuario a recordar, debe preguntarle primero",
        },
      },
      required: ["name"],
    },
  },
];

module.exports = { functions };
