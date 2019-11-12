import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthHttp } from '../auth-http';
import { environment } from '../../../environments/environment';
import { Usuario, AlteraSenha, AlteraEmail } from '../types/model';

export class UsuarioFiltro {
  nome: string;
  ativo = true;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class UsuarioService {

  usuariosUrl: string;

  constructor(private http: AuthHttp) {
    this.usuariosUrl = `${environment.apiUrl}/usuarios`;
  }

  pesquisar(filtro: UsuarioFiltro): Observable<any> {
    let params = new HttpParams();

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    params = params.set('ativo', filtro.ativo.toString());

    return this.http.get(`${this.usuariosUrl}`, { params })
      .pipe(map((response: any) => {
        const usuarios = response.content;

        const resultado = {
          usuarios,
          total: response.totalElements
        };

        return resultado;
      }));
  }

  listarTodos(): Observable<any> {
    return this.http.get(this.usuariosUrl)
      .pipe(map((response: any) => response.content));
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.usuariosUrl}/${id}`);
  }

  mudarStatus(id: number, ativo: boolean): Observable<any> {
    return this.http.put(`${this.usuariosUrl}/${id}/ativo`, ativo);
  }

  adicionar(usuario: Usuario): Observable<Usuario> {
    return this.http.post(this.usuariosUrl, JSON.stringify(usuario))
      .pipe(map((response: any) => response as Usuario));
  }

  atualizar(usuario: Usuario): Observable<Usuario> {
    return this.http.put(`${this.usuariosUrl}/${usuario.id}`,
        JSON.stringify(usuario))
      .pipe(map((response: any) => response as Usuario));
  }

  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get(`${this.usuariosUrl}/${id}`)
      .pipe(map((response: any) => response as Usuario));
  }

  alterarSenha(id: number, alteraSenha: AlteraSenha): Observable<any> {
    return this.http.put(`${this.usuariosUrl}/${id}/alterar-senha`,
        JSON.stringify(alteraSenha));
  }

  alterarMinhaSenha(alteraSenha: AlteraSenha): Observable<any> {
    return this.http.put(`${this.usuariosUrl}/alterar-senha`,
        JSON.stringify(alteraSenha));
  }

  alterarMeuEmail(alteraEmail: AlteraEmail): Observable<any> {
    return this.http.put(`${this.usuariosUrl}/alterar-email`,
        JSON.stringify(alteraEmail));
  }

}
