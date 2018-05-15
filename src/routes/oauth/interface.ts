import * as express from "express";
import { OAuthServer } from "./server";
import { Request as Req, Response as Res } from "oauth2-server";

export const GetToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  OAuthServer.instance.token(new Req(req), new Res(res), {})
    .then((r: any) => {
      res.send(r);
    })
    .catch((e: any) => {
      next(e);
    });
};

export const Authenticate = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  OAuthServer.instance.authenticate(new Req(req), new Res(res), {})
    .then((r: any) => {
      next();
    })
    .catch((e: any) => {
      next(e);
    });
};
