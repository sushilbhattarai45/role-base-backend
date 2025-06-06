import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/userRoutes";
import imageRoutes from "./src/routes/imageRoutes";
import corsConfig from "./src/config/corsConfig";
import { errorHandler } from "./src/middlewares/errorHandler";
import limiter from "./src/middlewares/rateLimitMiddleware";
const App = express();

App.use(cors(corsConfig));
App.use(express.json());
App.listen(3001, () => {
  console.log("3001");
});
App.use(limiter);

App.use("/user", userRoutes);
App.use("/image", imageRoutes);

App.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    errorHandler(err, req, res, next);
  }
);

export default App;
