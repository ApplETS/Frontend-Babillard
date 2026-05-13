declare interface Env {
  NG_APP_API_URL:string;
  NG_APP_API_URL_DEV:string;
  NODE_ENV: string;
  NG_APP_REDIRECT_URL: string;
  NG_APP_OPENID_CLIENT_SECRET: string;
  NG_APP_OPENID_CLIENT_ID: string;
  NG_APP_OPENID_BASE_URL: string;
  NG_APP_OPENID_ISSUER: string;
}
declare interface ImportMeta {
  readonly env: Env;
}
