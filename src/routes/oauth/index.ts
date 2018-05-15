import * as express from "express";

import { IRouter } from "../models/IRouter";
import { GetToken } from "./interface";


const r: express.Router = express.Router();

r.post("/token", GetToken)

export const router: IRouter = { path: "/oauth", router: r };
