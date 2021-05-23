let apiBaseUrl: string = 'https://api.gymtrack.nl'
let authBaseUrl: string = 'https://auth.gymtrack.nl/auth'
let appBaseUrl: string = 'https://app.gymtrack.nl'

if ((window.location.origin).includes('test')){
  apiBaseUrl = 'https://test-api.gymtrack.nl'
  authBaseUrl = 'https://test-auth.gymtrack.nl/auth'
  appBaseUrl = 'https://test-app.gymtrack.nl'
}

export const environment = {
  production: true,
  apiBaseUrl: apiBaseUrl,
  authBaseUrl: authBaseUrl,
  redirectUrl: appBaseUrl
};
