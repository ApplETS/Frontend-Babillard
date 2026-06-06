declare interface Env {
  NG_APP_API_URL_PROD:string;
  NG_APP_API_URL_DEV:string;
  NODE_ENV: string;
  NG_APP_REDIRECT_URL: string;
  NG_APP_OPENID_CLIENT_ID: string;
  NG_APP_OPENID_BASE_URL: string;
  NG_APP_OPENID_ISSUER: string;
  NG_APP_OPENID_WELLKNOWN: string;
  NG_APP_POST_LOGOUT_REDIRECT_URI: string;
}
declare interface ImportMeta {
  readonly env: Env;
}
