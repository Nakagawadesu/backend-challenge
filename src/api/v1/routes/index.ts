import server from "../server";
import { Router } from "express";
import ResponseHandler from "@middlewares/Responsehandler";
import getUserInfoController from "../controllers/users/getUsersInfoController";
const routes = Router();

routes.get("/users/all", getUserInfoController);

export default routes;
