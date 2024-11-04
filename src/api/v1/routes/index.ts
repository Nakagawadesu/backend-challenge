import server from "../server";
import { Router } from "express";
import ResponseHandler from "@middlewares/Responsehandler";
import getUserInfoController from "../controllers/users/getUsersInfoController";
const routes = Router();

/**
 * @swagger
 * /api/v1/users/all:
 *   get:
 *     summary: Obtém informações de todos os usuários
 *     description: Esta rota retorna uma lista de informações formatadas de todos os usuários obtidos da API externa definida por `USERS_API_URL`.
 *     responses:
 *       200:
 *         description: Lista de usuários recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Identificador único do usuário
 *                   name:
 *                     type: string
 *                     description: Nome do usuário
 *                   email:
 *                     type: string
 *                     description: E-mail formatado do usuário
 *                   lastActivity:
 *                     type: string
 *                     description: Data da última atividade em formato legível
 *                   isPayer:
 *                     type: boolean
 *                     description: Indica se o usuário é pagador
 *                   isActive:
 *                     type: boolean
 *                     description: Indica se o usuário está ativo
 *       500:
 *         description: Erro interno do servidor
 */
routes.get("/users/all", getUserInfoController);

export default routes;
