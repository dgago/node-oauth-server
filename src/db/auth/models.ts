export interface IClient {
  id: string;
  secret: string;
  redirectUris: string[];
  grants: string[];
  userId?: string;
  scopes: string[];
}

export interface IToken {
  accessToken: string;
  refreshToken?: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt?: Date;
  clientId: string;
  userId: string;
}

export interface IUser {
  id: string;
  username: string;
  password: string;
}

export interface ICode {
  authorizationCode: string;
  expiresAt: Date;
  redirectUri: string;
  scope: string;
  clientId: string;
  userId: string;
}