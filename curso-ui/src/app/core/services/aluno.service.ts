import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as moment from 'moment';

import { AuthHttp } from '../auth-http';
import { environment } from '../../../environments/environment';
import { Aluno, Responsavel } from '../types/model';

export class AlunoFiltro {
  cpf: string;
  nome: string;
  ativo = true;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class AlunoService {

  alunosUrl: string;

  constructor(private http: AuthHttp) {
    this.alunosUrl = `${environment.apiUrl}/alunos`;
  }

  pesquisar(filtro: AlunoFiltro): Observable<any> {
    let params = new HttpParams();

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());

    if (filtro.cpf) {
      params = params.set('cpf', filtro.cpf);
    }

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    params = params.set('ativo', filtro.ativo.toString());

    return this.http.get(`${this.alunosUrl}`, { params })
      .pipe(map((response: any) => {
        const alunos = response.content;
        const resultado = {
          alunos,
          total: response.totalElements
        };
        return resultado;
      }));
  }

  listarTodos(): Observable<any> {
    return this.http.get(`${this.alunosUrl}`)
      .pipe(map(response => response));
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.alunosUrl}/${id}`);
  }

  mudarStatus(id: number, ativo: boolean): Observable<any> {
    return this.http.put(`${this.alunosUrl}/${id}/ativo`, ativo);
  }

  adicionar(aluno: Aluno): Observable<Aluno> {
    return this.http.post(this.alunosUrl, JSON.stringify(aluno))
    .pipe(map((response: any) => {
      const alunoAdicionado = response as Aluno;
      this.converterStringsParaDatasAlunos([alunoAdicionado]);
      alunoAdicionado.responsaveis.forEach(responsavel => {
        this.converterStringsParaDatasResponsaveis([alunoAdicionado.responsaveis.find(f => f.id === responsavel.id)]);
      });
      return alunoAdicionado;
    }));
  }

  atualizar(aluno: Aluno): Observable<Aluno> {
    return this.http.put(`${this.alunosUrl}/${aluno.id}`,
        JSON.stringify(aluno))
      .pipe(map((response: any) => {
        const alunoAtualizado = response as Aluno;
        this.converterStringsParaDatasAlunos([alunoAtualizado]);
        alunoAtualizado.responsaveis.forEach(responsavel => {
          this.converterStringsParaDatasResponsaveis([alunoAtualizado.responsaveis.find(f => f.id === responsavel.id)]);
        });
        return alunoAtualizado;
      }));
  }

  buscarPorId(id: number): Observable<Aluno> {
    return this.http.get(`${this.alunosUrl}/${id}`)
      .pipe(map((response: any) => {
        const aluno = response as Aluno;
        this.converterStringsParaDatasAlunos([aluno]);
        aluno.responsaveis.forEach(responsavel => {
          this.converterStringsParaDatasResponsaveis([aluno.responsaveis.find(f => f.id === responsavel.id)]);
        });
        return aluno;
      }));
  }

  private converterStringsParaDatasAlunos(alunos: Aluno[]) {
    for (const aluno of alunos) {
      aluno.dataNascimento = moment(aluno.dataNascimento,
        'YYYY-MM-DD').toDate();
    }
  }

  private converterStringsParaDatasResponsaveis(responsaveis: Responsavel[]) {
    for (const responsavel of responsaveis) {
      if (responsavel.dataNascimento) {
        responsavel.dataNascimento = moment(responsavel.dataNascimento,
          'YYYY-MM-DD').toDate();
      }
    }
  }

}
