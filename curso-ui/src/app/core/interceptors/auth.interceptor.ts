import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url.match(/viacep/)) {
      const authService = this.injector.get(AuthService);
      if (!authService.isAccessTokenInvalido()) {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
          const authRequest = request.clone({
              setHeaders: {
                'Authorization': `Bearer ${authService.obterToken()}`
              }
            });
          return next.handle(authRequest);
        } else {
          return next.handle(request);
        }
      } else {
        return next.handle(request);
      }
    } else {
      return next.handle(request);
    }
  }

}
