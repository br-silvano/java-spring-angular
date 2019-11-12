import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from '../../../environments/environment';
import { Login } from '../types/model';

@Injectable()
export class AuthService {

  oauthTokenUrl: string;
  jwtPayload: any;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    this.oauthTokenUrl = `${environment.apiUrl}/oauth/token`;
    this.carregarToken();
  }

  login(login: Login): Observable<void> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');

    const body = `username=${login.usuario}&password=${login.senha}&grant_type=password`;

    return this.http.post(this.oauthTokenUrl, body,
      { headers, withCredentials: false })
      .pipe(map((response: any) => {
        const access_token = response.access_token;
        const refresh_token = response.refresh_token;
        const json = { access_token, refresh_token };
        this.armazenarToken(json);
      }))
      .pipe(catchError(response => {
        if (response.status === 400) {
          if (response.error.error === 'invalid_grant') {
            return Promise.reject('Usuário ou senha inválida!');
          }
        }

        return Promise.reject(response);
      }));
  }

  obterNovoAccessToken(): Promise<void> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');

    const body = `refresh_token=${this.obterRefreshToken()}&grant_type=refresh_token`;

    return this.http.post(this.oauthTokenUrl, body,
      { headers, withCredentials: false })
    .toPromise()
    .then((response: any) => {
      const access_token = response.access_token;
      const refresh_token = response.refresh_token;
      const json = { access_token, refresh_token };
      this.armazenarToken(json);

      console.log('Novo access token criado!');

      return Promise.resolve(null);
    })
    .catch(response => {
      console.error('Erro ao renovar token.', response);
      return Promise.resolve(null);
    });

  }

  limparAccessToken() {
    localStorage.removeItem('token');
    this.jwtPayload = null;
  }

  isAccessTokenInvalido(): boolean {
    let accessToken = '';
    const token = localStorage.getItem('token');
    if (token) {
      const json = JSON.parse(token);
      accessToken = json.access_token;
    }
    return !token || this.jwtHelper.isTokenExpired(accessToken);
  }

  temPermissao(permissao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }

  temQualquerPermissao(roles: any) {
    for (const role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }

    return false;
  }

  private armazenarToken(json: any) {
    this.jwtPayload = this.jwtHelper.decodeToken(json.access_token);
    const token = JSON.stringify(json);
    localStorage.setItem('token', token);
  }

  private carregarToken() {
    const token = localStorage.getItem('token');
    if (token) {
      const json = JSON.parse(token);
      this.armazenarToken(json);
    }
  }

  obterToken(): string {
    let accessToken = '';
    const token = localStorage.getItem('token');
    if (token) {
      const json = JSON.parse(token);
      accessToken = json.access_token;
    }
    return accessToken;
  }

  obterRefreshToken(): string {
    let refreshToken = '';
    const token = localStorage.getItem('token');
    if (token) {
      const json = JSON.parse(token);
      refreshToken = json.refresh_token;
    }
    return refreshToken;
  }

}
