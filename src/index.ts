import http from "http";
import express from "express";
import WebSocket from "ws";
import cors from "cors";
import { initDB } from "./database";
import { body, validationResult } from "express-validator";
import { config as envConfig } from "dotenv";
import { allMessages, newMessage } from "./services/messages";
import bodyParser from 'body-parser';

envConfig();
const env = process.env;

(async () => {
  await initDB();

  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  app.use(bodyParser.json())
  app.use(cors());

  wss.on("connection", (ws) => {
    ws.send("welcome to chat-application v1");
  });

  app.get("/messages", async (_req, res) => {
    res.status(200).send(await allMessages());
  });

  app.post(
    "/new-message",
    body("name").isString().isLength({ min: 3, max: 24 }),
    body("message").isString().isLength({ min: 1 }),
    async (req, res) => {
      const result = validationResult(req);
      if (result.isEmpty()) {
        /* remove oldest message after 9 */
        await newMessage(req.body.name,req.body.message);
        wss.emit("new-message");

        res.status(200).send({ result: true });
      } else {
        res.status(400).send({ result: false, errors: result.array() });
      }
    }
  );

  app.listen(env.PORT, () =>
    console.log(`chat-application listen ${env.PORT}`)
  );
})();
