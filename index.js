const {
  default: makeWASocket,
  useMultiFileAuthState,
} = require("@whiskeysockets/baileys");
const { flow } = require("./controllers/flow");
const debug = false;

(async () => {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const sock = makeWASocket({ auth: state, printQRInTerminal: true });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async (response) => {
    try {
      /**
       ** Debug
       */
      if (debug) {
        console.log(JSON.stringify(response, undefined, 2));
      }

      /**
       ** From User
       */
      if (!response.messages[0].key.fromMe) {
        /**
         *? State: Available
         */
        sock.sendPresenceUpdate(
          "available",
          response.messages[0].key.remoteJid
        );

        await flow(sock, response);

        return sock.readMessages([response.messages[0].key]);
      }
    } catch (error) {
      console.log(error);
    }
  });
})();
