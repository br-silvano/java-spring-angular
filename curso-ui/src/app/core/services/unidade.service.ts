import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthHttp } from '../auth-http';
import { environment } from '../../../environments/environment';
import { Unidade } from '../types/model';

export class UnidadeFiltro {
  codigo: string;
  nome: string;
  ativo = true;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class UnidadeService {

  unidadesUrl: string;

  constructor(private http: AuthHttp) {
    this.unidadesUrl = `${environment.apiUrl}/unidades`;
  }

  pesquisar(filtro: UnidadeFiltro): Observable<any> {
    let params = new HttpParams();

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());

    if (filtro.codigo) {
      params = params.set('codigo', filtro.codigo);
    }

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    params = params.set('ativo', filtro.ativo.toString());

    return this.http.get(`${this.unidadesUrl}`, { params })
      .pipe(map((response: any) => {
        const unidades = response.content;

        const resultado = {
          unidades,
          total: response.totalElements
        };

        return resultado;
      }));
  }

  listarTodas(): Observable<any> {
    return this.http.get(`${this.unidadesUrl}`)
      .pipe(map(response => response));
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.unidadesUrl}/${id}`);
  }

  mudarStatus(id: number, ativo: boolean): Observable<any> {
    return this.http.put(`${this.unidadesUrl}/${id}/ativo`, ativo);
  }

  adicionar(unidade: Unidade): Observable<Unidade> {
    return this.http.post(this.unidadesUrl, JSON.stringify(unidade))
      .pipe(map((response: any) => response as Unidade));
  }

  atualizar(unidade: Unidade): Observable<Unidade> {
    return this.http.put(`${this.unidadesUrl}/${unidade.id}`,
        JSON.stringify(unidade))
      .pipe(map((response: any) => response as Unidade));
  }

  buscarPorId(id: number): Observable<Unidade> {
    return this.http.get(`${this.unidadesUrl}/${id}`)
      .pipe(map((response: any) => response as Unidade));
  }

}
