let apiBaseUrl: string = 'https://api.doyoueventrack.app'
let authBaseUrl: string = 'https://auth.doyoueventrack.app/auth'
let appBaseUrl: string = 'https://bro.doyoueventrack.app'

if ((window.location.origin).includes('test')){
  apiBaseUrl = 'https://test-api.doyoueventrack.app'
  authBaseUrl = 'https://test-auth.doyoueventrack.app/auth'
  appBaseUrl = 'https://test-bro.doyoueventrack.app'
}

export const environment = {
  production: true,
  apiBaseUrl: apiBaseUrl,
  authBaseUrl: authBaseUrl,
  redirectUrl: appBaseUrl
};
