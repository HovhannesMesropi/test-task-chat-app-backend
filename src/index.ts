import http from "http";
import express from "express";
import WebSocket from "ws";
import cors from "cors";
import { initDB } from "./database";
import { body, validationResult } from "express-validator";
import { config as envConfig } from "dotenv";
import {
  allMessages,
  newMessage,
  removeOldestMessage,
} from "./services/messages";
import bodyParser from "body-parser";

envConfig();
const env = process.env;

(async () => {
  await initDB();

  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });
  app.use(bodyParser.json());
  app.use(cors());

  wss.on("connection", (ws) => {
    ws.send("welcome to chat-application v1");
  });

  app.get("/messages", async (_req, res) => {
    const messages = await allMessages();
    res.status(200).send(messages);
  });

  app.post(
    "/new-message",
    body("name").isString().isLength({ min: 0, max: 24 }),
    body("message").isString().isLength({ min: 0 }),
    async (req, res) => {
      const result = validationResult(req);
      if (result.isEmpty()) {
        /* save new message */
        await newMessage(req.body.name, req.body.message);

        /* remove oldest message */
        await removeOldestMessage();

        /* send all clients about update of messages */
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send("messages-updated");
          }
        });

        res.status(200).send({ result: true });
      } else {
        res.status(400).send({ result: false, errors: result.array() });
      }
    }
  );

  server.listen(env.PORT, () =>
    console.log(`chat-application listen ${env.PORT}`)
  );
})();
