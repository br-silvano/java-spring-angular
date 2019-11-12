import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthHttp } from '../auth-http';
import { environment } from '../../../environments/environment';
import { StatusTurma } from '../types/model';

@Injectable()
export class StatusTurmaService {

  statusTurmaUrl: string;

  constructor(private http: AuthHttp) {
    this.statusTurmaUrl = `${environment.apiUrl}/statuss-turma`;
  }

  listarTodos(): Observable<StatusTurma[]> {
    return this.http.get(`${this.statusTurmaUrl}?todos`)
      .pipe(map((response: any) => response));
  }

}
