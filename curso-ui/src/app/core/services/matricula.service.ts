import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthHttp } from '../auth-http';
import { environment } from '../../../environments/environment';
import { Matricula, StatusMatricula } from '../types/model';

export class MatriculaFiltro {
  id: number;
  cpf: string;
  statusMatricula: StatusMatricula = new StatusMatricula();
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class MatriculaService {

  matriculasUrl: string;

  constructor(private http: AuthHttp) {
    this.matriculasUrl = `${environment.apiUrl}/matriculas`;
  }

  pesquisar(filtro: MatriculaFiltro): Observable<any> {
    let params = new HttpParams();

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());

    if (filtro.id) {
      params = params.set('id', filtro.id.toString());
    }

    if (filtro.cpf) {
      params = params.set('cpf', filtro.cpf);
    }

    if (filtro.statusMatricula) {
      params = params.set('status', filtro.statusMatricula.id.toString());
    }

    return this.http.get(`${this.matriculasUrl}`, { params })
      .pipe(map((response: any) => {
        const matriculas = response.content;

        const resultado = {
          matriculas,
          total: response.totalElements
        };

        return resultado;
      }));
  }

  listarTodas(): Observable<any> {
    return this.http.get(`${this.matriculasUrl}`)
      .pipe(map(response => response));
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.matriculasUrl}/${id}`);
  }

  adicionar(matricula: Matricula): Observable<Matricula> {
    return this.http.post(this.matriculasUrl, JSON.stringify(matricula))
      .pipe(map((response: any) => response as Matricula));
  }

  atualizar(matricula: Matricula): Observable<Matricula> {
    return this.http.put(`${this.matriculasUrl}/${matricula.id}`,
        JSON.stringify(matricula))
      .pipe(map((response: any) => response as Matricula));
  }

  buscarPorId(id: number): Observable<Matricula> {
    return this.http.get(`${this.matriculasUrl}/${id}`)
      .pipe(map((response: any) => response as Matricula));
  }

}
