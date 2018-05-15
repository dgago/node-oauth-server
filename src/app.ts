import * as express from "express";
// import * as morgan from "morgan";
import { Request as Req, Response as Res } from "oauth2-server";
import * as MemoryStore from "./db/auth/memory/index";

const ExpressOAuth = require("express-oauth-server");

import { IRouter } from "./routes/models/IRouter";

/**
 * Express App Bootstrapper.
 */
export const createApp = (routers: IRouter[]): express.Application => {
  const app: express.Application = express();

  // oauth
  const oauthMemory = new MemoryStore.InMemoryCache();
  const oauth = new ExpressOAuth({ model: oauthMemory }).server; //new OAuth.OAuth2Server({ model: oauthMemory });

  app.set("oauth", oauth);

  // app.use(morgan(process.env.NODE_ENV || "dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // oauth routes
  app.post(
    "/oauth/token",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      oauth
        .token(new Req(req), new Res(res), {})
        .then((r: any) => {
          res.send(r);
        })
        .catch((e: any) => {
          next(e);
        });
    }
  );
  // app.post(
  //   "/authorize",
  //   (
  //     req: express.Request,
  //     res: express.Response,
  //     next: express.NextFunction
  //   ) => {
  //     oauth
  //       .authorize(new Req(req), new Res(res), {})
  //       .then((r: any) => {
  //         res.send(r);
  //       })
  //       .catch((e: any) => {
  //         next(e);
  //       });
  //   }
  // );
  // app.post("/authenticate", oauth.authenticate());

  // Dummy route for GET /
  app.get(
    "/",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      oauth
        .authenticate(new Req(req), new Res(res), {})
        .then((r: any) => {
          next();
        })
        .catch((e: any) => {
          next(e);
        });
    },
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
