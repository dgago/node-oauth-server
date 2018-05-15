import * as express from "express";
// import * as morgan from "morgan";
import { IRouter } from "./routes/models/IRouter";
import { Authenticate } from "./routes/oauth/interface";

/**
 * Express App Bootstrapper.
 */
export const createApp = (routers: IRouter[]): express.Application => {
  const app: express.Application = express();

  // app.use(morgan(process.env.NODE_ENV || "dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Dummy route for GET /
  // TODO: esta debería ser la home page
  app.get(
    "/",
    Authenticate,
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      res.send({ status: "OK" });
    }
  );

  // Routers setup
  if (routers) {
    for (const r of routers) {
      app.use(r.path, r.router);
    }
  }

  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (req.xhr) {
        res.status(500).json(err);
      } else {
        next(err);
      }
    }
  );

  return app;
};
