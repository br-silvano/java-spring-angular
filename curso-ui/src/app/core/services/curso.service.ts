import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthHttp } from '../auth-http';
import { environment } from '../../../environments/environment';
import { Curso } from '../types/model';

export class CursoFiltro {
  codigo: string;
  descricao: string;
  ativo = true;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class CursoService {

  cursosUrl: string;

  constructor(private http: AuthHttp) {
    this.cursosUrl = `${environment.apiUrl}/cursos`;
  }

  pesquisar(filtro: CursoFiltro): Observable<any> {
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

    return this.http.get(`${this.cursosUrl}`, { params })
      .pipe(map((response: any) => {
        const cursos = response.content;

        const resultado = {
          cursos,
          total: response.totalElements
        };

        return resultado;
      }));
  }

  listarTodos(): Observable<any> {
    return this.http.get(this.cursosUrl)
      .pipe(map(response => response));
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.cursosUrl}/${id}`);
  }

  mudarStatus(id: number, ativo: boolean): Observable<any> {
    return this.http.put(`${this.cursosUrl}/${id}/ativo`, ativo);
  }

  adicionar(curso: Curso): Observable<Curso> {
    return this.http.post(this.cursosUrl, JSON.stringify(curso))
      .pipe(map((response: any) => response as Curso));
  }

  atualizar(curso: Curso): Observable<Curso> {
    return this.http.put(`${this.cursosUrl}/${curso.id}`,
        JSON.stringify(curso))
      .pipe(map((response: any) => response as Curso));
  }

  buscarPorId(id: number): Observable<Curso> {
    return this.http.get(`${this.cursosUrl}/${id}`)
      .pipe(map((response: any) => response as Curso));
  }

}
