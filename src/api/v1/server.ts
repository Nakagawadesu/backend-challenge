import express from "express";
import Logger from "./helpers/Logger";
import routes from "@routes/index";
import ResponseHandler from "@middlewares/Responsehandler";
Logger.groupEnd();
Logger.group("Server");

if (process.env.NODE_ENV === "development") {
  Logger.info(`Running on development mode`);
  require("dotenv").config();
} else if (process.env.NODE_ENV === "production") {
  Logger.info(`Running on production mode`);
}

const server = express();

server.use(express.json());
server.use("/api/v1", routes);
server.use(ResponseHandler.handle);
export default server;
