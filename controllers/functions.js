const functions = [
  {
    name: "eliminar_chat",
    description: "Limpia o eliminar el chat o el historial de un usuario.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  /*{
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
  },*/
  {
    name: "recordar_nombre",
    description:
      "Cuando el usuario pide recordar su nombre, o que lo llamen por su nombre, lo guarda en la base de datos.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Nombre del usuario a recordar",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "enviar_dashboard",
    description:
      "Cuando el usuario pide enviar el link del dashboard o el panel de configuración, lo envia.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];

module.exports = { functions };
