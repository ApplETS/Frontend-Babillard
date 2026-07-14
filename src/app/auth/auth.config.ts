import { LogLevel, PassedInitialConfig } from 'angular-auth-oidc-client';
import { environment } from '../../environments/environment';

export const authConfig: PassedInitialConfig = {
  config: {
    authWellknownEndpointUrl: environment.OPENID_WELLKNOWN,
    authority: environment.OPENID_ISSUER,
    redirectUrl: environment.REDIRECT_URL,
    postLogoutRedirectUri: environment.POST_LOGOUT_REDIRECT_URI,
    clientId: environment.OPENID_CLIENT_ID,
    scope: 'openid profile email offline_access',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    logLevel: LogLevel.Debug,
    disableIdTokenValidation: false,
    autoUserInfo: false,
  },
};
