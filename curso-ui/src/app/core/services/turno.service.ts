import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthHttp } from '../auth-http';
import { environment } from '../../../environments/environment';
import { Turno } from '../types/model';

export class TurnoFiltro {
  codigo: string;
  descricao: string;
  ativo = true;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class TurnoService {

  turnosUrl: string;

  constructor(private http: AuthHttp) {
    this.turnosUrl = `${environment.apiUrl}/turnos`;
  }

  pesquisar(filtro: TurnoFiltro): Observable<any> {
    let params = new HttpParams();

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());

    if (filtro.codigo) {
      params = params.set('codigo', filtro.codigo);
    }

    if (filtro.descricao) {
      params = params.set('descricao', filtro.descricao);
    }

    params = params.set('ativo', filtro.ativo.toString());

    return this.http.get(`${this.turnosUrl}`, { params })
      .pipe(map((response: any) => {
        const turnos = response.content;

        const resultado = {
          turnos,
          total: response.totalElements
        };

        return resultado;
      }));
  }

  listarTodos(): Observable<any> {
    return this.http.get(this.turnosUrl)
      .pipe(map(response => response));
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.turnosUrl}/${id}`);
  }

  mudarStatus(id: number, ativo: boolean): Observable<any> {
    return this.http.put(`${this.turnosUrl}/${id}/ativo`, ativo);
  }

  adicionar(turno: Turno): Observable<Turno> {
    return this.http.post(this.turnosUrl, JSON.stringify(turno))
      .pipe(map((response: any) => response as Turno));
  }

  atualizar(turno: Turno): Observable<Turno> {
    return this.http.put(`${this.turnosUrl}/${turno.id}`,
        JSON.stringify(turno))
      .pipe(map((response: any) => response as Turno));
  }

  buscarPorId(id: number): Observable<Turno> {
    return this.http.get(`${this.turnosUrl}/${id}`)
      .pipe(map((response: any) => response as Turno));
  }

}
