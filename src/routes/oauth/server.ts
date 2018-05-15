const ExpressOAuth = require("express-oauth-server");
import * as MemoryStore from "../../db/auth/memory/index";
import * as OAuth2Server from "oauth2-server";

export class OAuthServer {
  private static _instance: OAuth2Server;

  static get instance(): OAuth2Server {
    if (!this._instance) {
      this._instance = new ExpressOAuth({
        model: new MemoryStore.InMemoryCache()
      }).server;
    }
    return this._instance;
  }
}
