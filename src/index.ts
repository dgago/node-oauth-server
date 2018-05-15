import * as express from "express";
import * as http from "http";

import { initConfig } from "./config/config";
import { createApp } from "./app";
import { createServer } from "./server";

initConfig();

import { router as oauth } from "./routes/oauth/index";

const app: express.Application = createApp([oauth]);
const server: http.Server = createServer(app);
