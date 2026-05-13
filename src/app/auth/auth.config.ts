import { LogLevel, PassedInitialConfig } from 'angular-auth-oidc-client';
import { environment } from '../../environments/environment';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: environment.OPENID_ISSUER,
    redirectUrl: environment.REDIRECT_URL,
    postLogoutRedirectUri: 'https://localhost:8080',
    clientId: environment.OPENID_CLIENT_ID,
    scope: 'openid profile email offline_access',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    logLevel: LogLevel.Debug,
    disableIdTokenValidation: true,
    autoUserInfo: false,
  },
};
