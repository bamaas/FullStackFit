const protocol: string = 'https://';
const baseDomain: string = 'gymtrack.nl';
let subDomains = {
  backend: 'api',
  frontend: 'app',
  auth: 'auth' 
}

if ((window.location.origin).includes('test')){
  for (let subDomain in subDomains){
    subDomain = subDomain + '-test';
  }
}

let apiBaseUrl: string = protocol + subDomains['backend'] + '.' + baseDomain;
let authBaseUrl: string = protocol + subDomains['auth'] + '.' + baseDomain;
let appBaseUrl: string = protocol + subDomains['frontend'] + '.' + baseDomain;

export const environment = {
  production: true,
  apiBaseUrl: apiBaseUrl,
  authBaseUrl: authBaseUrl,
  redirectUrl: appBaseUrl
};
