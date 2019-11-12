import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, from} from 'rxjs';

import { AuthService } from './services/auth.service';

export class NotAuthenticatedError {}

export interface IRequestOptions {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  body?: any;
}

export function AuthHttpCreator(auth: AuthService, http: HttpClient) {
  return new AuthHttp(http, auth);
}

@Injectable()
export class AuthHttp {

  public constructor(
    public http: HttpClient,
    private auth: AuthService
  ) {}

  public delete(url: string, options: IRequestOptions = {}): Observable<Response> {
    options.headers = this.setHttpHeaders(options);
    return this.fazerRequisicao(() => this.http.delete(url, options));
  }

  public patch(url: string, body: any, options: IRequestOptions = {}): Observable<Response> {
    options.headers = this.setHttpHeaders(options);
    return this.fazerRequisicao(() => this.http.patch(url, body, options));
  }

  public head(url: string, options: IRequestOptions = {}): Observable<Response> {
    options.headers = this.setHttpHeaders(options);
    return this.fazerRequisicao(() => this.http.head(url, options));
  }

  public options(url: string, options: IRequestOptions = {}): Observable<Response> {
    options.headers = this.setHttpHeaders(options);
    return this.fazerRequisicao(() => this.http.options(url, options));
  }

  public get(url: string, options: IRequestOptions = {}): Observable<Response> {
    options.headers = this.setHttpHeaders(options);
    return this.fazerRequisicao(() => this.http.get(url, options));
  }

  public post(url: string, body: any, options: IRequestOptions = {}): Observable<Response> {
    options.headers = this.setHttpHeaders(options);
    return this.fazerRequisicao(() => this.http.post(url, body, options));
  }

  public put(url: string, body: any, options: IRequestOptions = {}): Observable<Response> {
    options.headers = this.setHttpHeaders(options);
    return this.fazerRequisicao(() => this.http.put(url, body, options));
  }

  private setHttpHeaders(options: IRequestOptions): HttpHeaders {
    let headers = options.headers || new HttpHeaders();
    if (!headers.hasOwnProperty('Accept')) {
      headers = headers.set('Accept', 'application/json');
    }
    if (!headers.hasOwnProperty('Content-Type')) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return headers;
  }

  private fazerRequisicao(fn: any): Observable<Response> {
    if (this.auth.isAccessTokenInvalido()) {
      console.log('Requisição HTTP com access token inválido. Obtendo novo token...');

      const chamadaNovoAccessToken = this.auth.obterNovoAccessToken()
        .then(() => {
          if (this.auth.isAccessTokenInvalido()) {
            throw new NotAuthenticatedError();
          }

          return fn().toPromise();
        });

      return from(chamadaNovoAccessToken);
    } else {
      return fn();
    }
  }
}
