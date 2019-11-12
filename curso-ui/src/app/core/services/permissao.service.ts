import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthHttp } from '../auth-http';
import { environment } from '../../../environments/environment';
import { Permissao } from '../types/model';

@Injectable()
export class PermissaoService {

  permissoesUrl: string;

  constructor(private http: AuthHttp) {
    this.permissoesUrl = `${environment.apiUrl}/permissoes`;
  }

  listarTodas(): Observable<Permissao[]> {
    return this.http.get(`${this.permissoesUrl}?todas`)
      .pipe(map((response: any) => response));
  }

}
