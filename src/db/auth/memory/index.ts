import {
  Client,
  Token,
  User,
  AuthorizationCode,
  Callback,
  Falsey,
  RefreshToken
} from "oauth2-server";

export class InMemoryCache {
  private clients: Client[];
  private tokens: Token[];
  private users: User[];
  private codes: AuthorizationCode[];

  constructor() {
    this.clients = [
      {
        id: "c1",
        secret: "p1",
        redirectUris: ["http://localhost:3000/"],
        grants: ["client_credentials", "password"],
        scopes: [],
        userId: "123"
      }
    ];
    this.tokens = [];
    this.users = [{ id: "123", username: "diego", password: "abc123" }];
    this.codes = [];
  }

  /**
   *
   * Validations
   */
  validateScope?(
    user: User,
    client: Client,
    scope: string,
    callback?: Callback<string[] | Falsey>
  ): Promise<string[] | Falsey> {
    console.log("VALIDATING SCOPE", [user, client, scope]);
    if (!scope) {
      callback(null, []);
      return null;
    }

    if (!scope.split(" ").every((s) => client.scopes.indexOf(s) >= 0)) {
      callback(false);
      return null;
    }

    callback(null, scope.split(" "));
    return null;
  }

  verifyScope(
    token: Token,
    scope: string,
    callback?: Callback<boolean>
  ): Promise<boolean> {
    console.log("VERIFYING SCOPE", [token, scope]);
    if (!token.scope) {
      callback(null, false);
      return null;
    }
    let requestedScopes = scope.split(" ");
    let authorizedScopes = token.scope.split(" ");

    callback(
      null,
      requestedScopes.every((s) => authorizedScopes.indexOf(s) >= 0)
    );
    return null;
  }

  /**
   *
   * Searches
   */
  getAccessToken(
    accessToken: string,
    callback?: Callback<Token>
  ): Promise<Token> {
    console.log("GETTING TOKEN", [accessToken]);
    let tokens = this.tokens.filter(function(token) {
      return token.accessToken === accessToken;
    });

    tokens.length ? callback(null, tokens[0]) : callback(null);
    return null;
  }

  getRefreshToken(
    refreshToken: string,
    callback?: Callback<RefreshToken>
  ): Promise<RefreshToken> {
    console.log("GETTING REFRESH TOKEN", [refreshToken]);
    let tokens = this.tokens.filter(function(token) {
      return token.refreshToken === refreshToken;
    });

    if (tokens.length) {
      const t: RefreshToken = {
        client: tokens[0].client,
        refreshToken,
        refreshTokenExpiresAt: tokens[0].refreshTokenExpiresAt,
        scope: tokens[0].scope,
        user: tokens[0].user
      };
      callback(null, t);
    } else {
      callback(null);
    }
    return null;
  }

  getClient(
    clientId: string,
    clientSecret: string,
    callback?: Callback<Client | Falsey>
  ): Promise<Client | Falsey> {
    console.log("GETTING CLIENT", [clientId, clientSecret]);

    let clients = this.clients.filter(function(client) {
      if (clientSecret) {
        return client.id === clientId && client.secret === clientSecret;
      } else {
        return client.id === clientId;
      }
    });

    console.log("GETTING CLIENT", clients);
    clients.length ? callback(null, clients[0]) : callback(false);

    return null;
  }

  getUserFromClient(
    client: Client,
    callback?: Callback<User | Falsey>
  ): Promise<User | Falsey> {
    console.log("GETTING USER BY CLIENT", [client]);
    let users = this.users.filter(function(user) {
      return user.id === client.userId;
    });

    users.length
      ? callback(null, {
          username: client.id,
          id: client.id,
          password: ""
        })
      : callback(false);

    return null;
  }

  getUser(
    username: string,
    password: string,
    callback?: Callback<User | Falsey>
  ): Promise<User | Falsey> {
    console.log("GETTING USER", [username, password]);
    var users = this.users.filter(function(user) {
      return user.username === username && user.password === password;
    });

    users.length ? callback(null, users[0]) : callback(false);
    return null;
  }

  /**
   *
   * Saves
   */
  saveToken(
    token: Token,
    client: Client,
    user: User,
    callback?: Callback<Token>
  ): Promise<Token> {
    console.log("SAVING TOKEN", [token, client, user]);
    const t = {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      client: client,
      user: user
    };
    this.tokens.push(t);

    // response value
    const { id, grants } = client;
    grants.splice(0, grants.length);
    const res = {
      accessToken: t.accessToken,
      accessTokenExpiresAt: t.accessTokenExpiresAt,
      refreshToken: t.refreshToken,
      refreshTokenExpiresAt: t.refreshTokenExpiresAt,
      client: { id, grants },
      user: { id: user.id }
    };
    callback(null, res);
    return null;
  }

  saveAuthorizationCode(
    code: AuthorizationCode,
    client: Client,
    user: User,
    callback?: Callback<AuthorizationCode>
  ): Promise<AuthorizationCode> {
    console.log("SAVING CODE", [code, client, user]);
    const ac = {
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      scope: code.scope,
      client: client,
      user: user
    };
    this.codes.push(ac);
    callback(null, ac);
    return null;
  }
}
