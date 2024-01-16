import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiKey = environment.kiwi.apiKey;
    request = request.clone({
      setHeaders: {
        apikey: apiKey
      }
    });
    return next.handle(request);
  }
}
