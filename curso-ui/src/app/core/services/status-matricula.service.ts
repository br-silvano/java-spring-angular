import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthHttp } from '../auth-http';
import { environment } from '../../../environments/environment';
import { StatusMatricula } from '../types/model';

@Injectable()
export class StatusMatriculaService {

  statusMatriculaUrl: string;

  constructor(private http: AuthHttp) {
    this.statusMatriculaUrl = `${environment.apiUrl}/statuss-matricula`;
  }

  listarTodos(): Observable<StatusMatricula[]> {
    return this.http.get(`${this.statusMatriculaUrl}?todos`)
      .pipe(map((response: any) => response));
  }

}
