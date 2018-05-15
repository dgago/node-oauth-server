import * as express from "express";
import * as http from "http";

import { initConfig } from "./config/config";
import { createApp } from "./app";
import { createServer } from "./server";

initConfig();

const app: express.Application = createApp([/*users, files, test*/]);
const server: http.Server = createServer(app);
