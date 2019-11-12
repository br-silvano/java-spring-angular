import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthHttp } from '../auth-http';
import { environment } from '../../../environments/environment';
import { Turma, StatusTurma } from '../types/model';

export class TurmaFiltro {
  codigo: string;
  nome: string;
  statusTurma: StatusTurma = new StatusTurma();
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class TurmaService {

  turmasUrl: string;

  constructor(private http: AuthHttp) {
    this.turmasUrl = `${environment.apiUrl}/turmas`;
  }

  pesquisar(filtro: TurmaFiltro): Observable<any> {
    let params = new HttpParams();

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());

    if (filtro.codigo) {
      params = params.set('codigo', filtro.codigo);
    }

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    if (filtro.statusTurma) {
      params = params.set('status', filtro.statusTurma.id.toString());
    }

    return this.http.get(`${this.turmasUrl}`, { params })
      .pipe(map((response: any) => {
        const turmas = response.content;

        const resultado = {
          turmas,
          total: response.totalElements
        };

        return resultado;
      }));
  }

  listarTodas(): Observable<any> {
    return this.http.get(`${this.turmasUrl}`)
      .pipe(map(response => response));
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.turmasUrl}/${id}`);
  }

  adicionar(turma: Turma): Observable<Turma> {
    return this.http.post(this.turmasUrl, JSON.stringify(turma))
      .pipe(map((response: any) => response as Turma));
  }

  atualizar(turma: Turma): Observable<Turma> {
    return this.http.put(`${this.turmasUrl}/${turma.id}`,
        JSON.stringify(turma))
      .pipe(map((response: any) => response as Turma));
  }

  buscarPorId(id: number): Observable<Turma> {
    return this.http.get(`${this.turmasUrl}/${id}`)
      .pipe(map((response: any) => response as Turma));
  }

}
