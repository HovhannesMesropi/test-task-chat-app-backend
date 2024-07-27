import http from "http";
import express from "express";
import WebSocket from "ws";
import cors from "cors";
import { initializeDatabase } from "./database";
import { body, validationResult } from "express-validator";

(async () => {
  await initializeDatabase();
  
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  app.use(cors());

  wss.on("connection", (ws) => {
    ws.send("welcome to chat-application v1");
  });

  app.get("/messages", () => {
    /* return message list */
  });

  app.post(
    "/new-message",
    body("name").isString().isLength({ min: 3, max: 24 }),
    body("message").isString().isLength({ min: 1 }),
    (req, res) => {
      const result = validationResult(req);
      if (result.isEmpty()) {
        /* remove oldest message after 9 */
        /* save message */
        wss.emit("new-message");

        res.status(200).send({ result: true });
      } else {
        res.status(400).send({ result: false, errors: result.array() });
      }
    }
  );
})();
