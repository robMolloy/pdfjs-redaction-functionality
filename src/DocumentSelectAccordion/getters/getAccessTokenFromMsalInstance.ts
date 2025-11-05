import { IPublicClientApplication } from '@azure/msal-browser';

export const getAccessTokenFromMsalInstance = async (
  msalInstance: IPublicClientApplication
) => {
  const tokenResponse = await msalInstance.acquireTokenSilent({
    scopes: [import.meta.env.VITE_POLARIS_GATEWAY_SCOPE],
    account: msalInstance.getActiveAccount()!
  });

  return tokenResponse.accessToken;
};
