import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; 
import { routes } from './app.routes';
import { authConfig } from './config/auth-config';
import { provideAuth0,AuthHttpInterceptor } from '@auth0/auth0-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),//provide Router globally via provideRouter() and pass the defined routes
     provideHttpClient(withInterceptorsFromDi()), // provide HttpClient globally via provideHttpClient()
     provideAuth0(authConfig),//Auth0 configuration provider for authentication and authorization
      {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    }
  ]
};
