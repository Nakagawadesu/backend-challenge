import { Request, Response, NextFunction } from "express";
import HttpStatusCode from "../utils/HttpStatusCode";
export type AssemblerPayload = {
  status: HttpStatusCode;
  message: string;
  details?: string;
  payload?: any;
  log?: string;
};
class ResponseAssembler {
  static assemble(
    req: Request,
    next: NextFunction,
    AssemblerPayload: AssemblerPayload
  ) {
    req.status = AssemblerPayload.status
      ? AssemblerPayload.status
      : HttpStatusCode.INTERNAL_SERVER_ERROR;

    req.message = AssemblerPayload.message
      ? AssemblerPayload.message
      : "Erro Interno do Servidor";

    req.details = AssemblerPayload.details ? AssemblerPayload.details : null;

    req.payload = AssemblerPayload.payload ? AssemblerPayload.payload : null;

    req.log = AssemblerPayload.log ? AssemblerPayload.log : null;
    next();
  }
}
export default ResponseAssembler;
