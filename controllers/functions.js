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
    description: "Cuando el usuario pide crear una imagen, crea una imagen.",
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
      "Cuando el usuario pide recordar su nombre, o que lo llamen por su nombre, lo guarda en la base de datos.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description:
            "Nombre del usuario a recordar",
        },
      },
      required: ["name"],
    },
  },
];

module.exports = { functions };
