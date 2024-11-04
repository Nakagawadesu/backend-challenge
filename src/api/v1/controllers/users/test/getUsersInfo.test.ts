import { Request, Response, NextFunction } from "express";
import axios from "axios";
import getUserInfoController from "../getUsersInfoController"; // Adjust path as necessary
import ResponseAssembler from "../../../middlewares/ResponseAssembler"; // Adjust path as necessary
import HttpStatusCode from "../../../utils/HttpStatusCode"; // Adjust path as necessary
import { UserFromDatabase } from "../../..//types/User"; // Adjust path as necessary
import { stat } from "fs";

jest.mock("axios");
jest.mock("../../../middlewares/ResponseAssembler");

describe("getUserInfoController", () => {
  const req = {} as Request;
  const res = {} as Response;
  const next = jest.fn() as NextFunction;
  beforeAll(() => {
    process.env.USERS_API_URL = "http://localhost:8080/users"; // Set the URL or any necessary env variable
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return user info when API call is successful", async () => {
    const mockUsers: UserFromDatabase[] = [
      {
        id: "0373e634-2d03-457e-a24d-2b0c8c3b7c37",
        name: "John Connor",
        email: "john.connor@niuco.com.br",
        status: "enabled",
        role: "admin",
        last_activity: 1649179152,
      },
      {
        id: "5fb75748-efa6-4d48-9930-14289d87466f",
        name: "Kyle Reese",
        email: "kyle.reese@gmail.com",
        status: "enabled",
        role: "editor",
        last_activity: 1649073600,
      },
      {
        id: "4c3dfa4c-3cee-4acb-b032-c09afad54ab4",
        name: "Bob Esponja",
        email: "bob.esponja@niuco.com.br",
        status: "enabled",
        role: "viewer",
        last_activity: 1649098800,
      },
      {
        id: "1e53b0f6-81a8-491e-9ae1-e24a2a2054bf",
        name: "John Doe",
        email: "john.doe@niuco.com.br",
        status: "disabled",
        role: "",
        last_activity: 1617643152,
      },
      {
        id: "37d4da9f-a2ad-48b7-80d4-b4e8d0afed13",
        name: "Mr. Robot",
        email: "robot@niuco.com.br",
        status: "enabled",
        role: "system",
        last_activity: 1649179729,
      },
      {
        id: "cc6df476-f552-4122-9c71-26d390c90326",
        name: "Patrick Estrela",
        email: "patrick.estrela@hotmail.com",
        status: "enabled",
        role: "viewer",
        last_activity: 1648487089,
      },
      {
        id: "c8d9f436-0565-4776-b08a-1f5f05580c47",
        name: "Robot Chicken",
        email: "robot.chicken@niuco.com.br",
        status: "enabled",
        role: "system",
        last_activity: 1648834324,
      },
      {
        id: "a2faabd2-26f8-4885-b006-e2ee9f71a76a",
        name: "Rick Grimes",
        email: "rick.grimes@niuco.com.br",
        status: "disabled",
        role: "",
        last_activity: 1586108161,
      },
      {
        id: "da5b56ee-87a4-4ce0-b504-0afcea8ef0ca",
        name: "Tio Patinhas",
        email: "tio.patinhas@gmail.com",
        status: "enabled",
        role: "viewer",
        last_activity: 1649345218,
      },
      {
        id: "52d609a3-0690-4043-8415-e78a2bd968f4",
        name: "Homer Simpson",
        email: "homer.simpson@hotmail.com",
        status: "enabled",
        role: "editor",
        last_activity: 1649241478,
      },
      {
        id: "7288a49f-d9da-48bf-a258-baaf9984c8c1",
        name: "Bruce Wayne",
        email: "bruce.wayne@niuco.com.br",
        status: "disabled",
        role: "editor",
        last_activity: 1586169478,
      },
    ];

    (axios.get as jest.Mock).mockResolvedValueOnce({
      status: HttpStatusCode.OK,
      data: mockUsers,
    });

    await getUserInfoController(req, res, next);

    expect(ResponseAssembler.assemble).toHaveBeenCalledWith(req, next, {
      payload: [
        {
          id: "0373e634-2d03-457e-a24d-2b0c8c3b7c37",
          name: "John Connor",
          email: "john.connor@niuco.com.br",
          lastActivity: "1970-01-20T02:06:19.152Z",
          isPayer: true,
          isActive: true,
        },
        {
          id: "5fb75748-efa6-4d48-9930-14289d87466f",
          name: "Kyle Reese",
          email: "ky**********@gmail.com",
          lastActivity: "1970-01-20T02:04:33.600Z",
          isPayer: true,
          isActive: true,
        },
        {
          id: "4c3dfa4c-3cee-4acb-b032-c09afad54ab4",
          name: "Bob Esponja",
          email: "bob.esponja@niuco.com.br",
          lastActivity: "1970-01-20T02:04:58.800Z",
          isPayer: false,
          isActive: true,
        },
        {
          id: "1e53b0f6-81a8-491e-9ae1-e24a2a2054bf",
          name: "John Doe",
          email: "john.doe@niuco.com.br",
          lastActivity: "1970-01-19T17:20:43.152Z",
          isPayer: false,
          isActive: false,
        },
        {
          id: "37d4da9f-a2ad-48b7-80d4-b4e8d0afed13",
          name: "Mr. Robot",
          email: "robot@niuco.com.br",
          lastActivity: "1970-01-20T02:06:19.729Z",
          isPayer: false,
          isActive: true,
        },
        {
          id: "cc6df476-f552-4122-9c71-26d390c90326",
          name: "Patrick Estrela",
          email: "pa***************@hotmail.com",
          lastActivity: "1970-01-20T01:54:47.089Z",
          isPayer: false,
          isActive: true,
        },
        {
          id: "c8d9f436-0565-4776-b08a-1f5f05580c47",
          name: "Robot Chicken",
          email: "robot.chicken@niuco.com.br",
          lastActivity: "1970-01-20T02:00:34.324Z",
          isPayer: false,
          isActive: true,
        },
        {
          id: "a2faabd2-26f8-4885-b006-e2ee9f71a76a",
          name: "Rick Grimes",
          email: "rick.grimes@niuco.com.br",
          lastActivity: "1970-01-19T08:35:08.161Z",
          isPayer: false,
          isActive: false,
        },
        {
          id: "da5b56ee-87a4-4ce0-b504-0afcea8ef0ca",
          name: "Tio Patinhas",
          email: "ti************@gmail.com",
          lastActivity: "1970-01-20T02:09:05.218Z",
          isPayer: false,
          isActive: true,
        },
        {
          id: "52d609a3-0690-4043-8415-e78a2bd968f4",
          name: "Homer Simpson",
          email: "ho*************@hotmail.com",
          lastActivity: "1970-01-20T02:07:21.478Z",
          isPayer: true,
          isActive: true,
        },
        {
          id: "7288a49f-d9da-48bf-a258-baaf9984c8c1",
          name: "Bruce Wayne",
          email: "bruce.wayne@niuco.com.br",
          lastActivity: "1970-01-19T08:36:09.478Z",
          isPayer: false,
          isActive: false,
        },
      ],
      message: "Users found",
      status: HttpStatusCode.OK,
    });
  });

  it("should return 500 if USERS_API_URL is not defined", async () => {
    process.env.USERS_API_URL = "";

    await getUserInfoController(req, res, next);

    expect(ResponseAssembler.assemble).toHaveBeenCalledWith(req, next, {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: "A URL da API de usuários não foi definida",
    });
  });

  it("should handle errors gracefully", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    await getUserInfoController(req, res, next);

    expect(ResponseAssembler.assemble).toHaveBeenCalledWith(req, next, {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
      details: "Error: Network Error",
    });
  });
});
