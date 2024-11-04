import { Request, Response, NextFunction } from "express";
import Logger from "../helpers/Logger";

class ResponseHandler {
  static handle(req: Request, res: Response, next: NextFunction) {
    Logger.group("ResponseHandler.handle");

    if (req.status === 500) {
      req.log ? Logger.error(req.log) : null;
    } else if (req.status >= 400 && req.status < 500) {
      req.log ? Logger.warning(req.log) : null;
    } else {
      req.log ? Logger.info(req.log) : null;
    }

    try {
      Logger.groupEnd();
      res.status(req.status).json({
        payload: req.payload ? req.payload : null,
        message: req.message,
        details: req.details ? req.details : null,
      });
    } catch (error) {
      Logger.groupEnd();
      res.status(500).json({
        message: "Invalid URL",
      });
    }
  }
}
export default ResponseHandler;
