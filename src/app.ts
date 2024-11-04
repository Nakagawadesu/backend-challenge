import Logger from "./api/v1/helpers/Logger";
import server from "./api/v1/server";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT;

if (process.env.NODE_ENV === "development") {
  server.listen(port, () => {
    Logger.success(
      `Server up and running on http://${
        (process.env.NODE_ENV && "localhost") || "127.0.0.1"
      }:${port}`
    );
  });
} else {
  server.listen(port, () => {
    Logger.success(`Server up and running on port ${port}`);
  });
}
