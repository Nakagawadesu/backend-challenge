//Common imports

import { Request, Response, NextFunction } from "express";
import Logger from "../../helpers/Logger";
import ResponseAssembler, {
  AssemblerPayload,
} from "../../middlewares/ResponseAssembler";
import HttpStatusCode from "../../utils/HttpStatusCode";
import { UserFromDatabase, UserReponse } from "api/v1/types/User";
import DateFormatter from "../../helpers/DateFormatter";

import {
  isUserPayer,
  isUserEnabled,
} from "../../helpers/userValidationsHelper";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const getUserInfoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Logger.group("getUserInfoController");
  try {
    const response = await axios.get(process.env.USERS_API_URL ?? "");

    if (!process.env.USERS_API_URL) {
      Logger.info("The USERS_API_URL is not defined");
      Logger.groupEnd();
      return ResponseAssembler.assemble(req, next, {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "A URL da API de usuários não foi definida",
      });
    }

    if (response.status !== HttpStatusCode.OK || !response.data) {
      Logger.info("The USERS_API_URL is : " + process.env.USERS_API_URL);
      Logger.groupEnd();
      return ResponseAssembler.assemble(req, next, {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "Algo deu errado com a API de usuários",
      });
    }

    const users: UserFromDatabase[] = response.data;

    Logger.info("Users found", JSON.stringify(users));

    const formatedUsers = users.map((user) => {
      let filteredUser: UserReponse = {
        id: user.id,
        name: user.name,
        email: DateFormatter.formatEmail(user.email),
        lastActivity: DateFormatter.dateFromUnixEpoch(user.last_activity),
        isPayer: isUserPayer(user),
        isActive: isUserEnabled(user),
      };
      return filteredUser;
    });

    Logger.success("Users formated", JSON.stringify(formatedUsers));

    Logger.groupEnd();
    return ResponseAssembler.assemble(req, next, {
      status: HttpStatusCode.OK,
      message: "Users found",
      payload: formatedUsers,
    });
  } catch (error) {
    Logger.error("Error while trying to get users", JSON.stringify(error));
    if (JSON.stringify(error).includes("ECONNREFUSED")) {
      Logger.error("The USERS_API_URL is not reachable");
      Logger.groupEnd();
      return ResponseAssembler.assemble(req, next, {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "A API de usuários não está acessível",
      });
    }
    Logger.groupEnd();
    return ResponseAssembler.assemble(req, next, {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
      details: `${error}`,
    });
  }
};
export default getUserInfoController;
