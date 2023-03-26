import express from "express";
import { Database } from "./database";
import { randomUUID } from "node:crypto";
import { router } from "./router/index";

const server = express();
const port = 3000;

server.use(express.json());

server.use(router);

server.listen(port, () => {
  console.log(`Server Running - end: http://localhost:${port}`);
});
