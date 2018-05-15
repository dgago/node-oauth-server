import * as config from "./config.json";

export const initConfig = () => {
  const env: string = process.env.NODE_ENV || "development";
  console.log("env *****", env);

  if (env === "development" || env === "test") {
    const envConfig: any = (<any>config)[env];

    Object.keys(envConfig).forEach((key) => {
      process.env[key] = envConfig[key];
    });
  }
};

export const verifyConfiguration = () => {};
