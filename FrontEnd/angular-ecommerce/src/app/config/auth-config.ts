export const authConfig = {
  domain: 'dev-t821pbekhfx741y2.us.auth0.com',
  clientId: '9Eq9SCZpo9xgNmNxlBVMfq2lTI9thjss',
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: 'http://localhost:8080'//backend API identifier for Auth0 to know which API to grant access to
  },
  httpInterceptor: {
    allowedList: [
      'http://localhost:8080/api/orders/*',
      'http://localhost:8080/api/checkout/*'
    ]
  }
};