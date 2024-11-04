import { Request } from "express";
import HttpStatusCode from "../helpers/HttpStatusCode";

declare module "express-serve-static-core" {
  interface Request {
    status: HttpStatusCode;
    message: string;
    error?: string;
    details?: string | null;
    payload?: any;
    log?: string | null;
  }
}
