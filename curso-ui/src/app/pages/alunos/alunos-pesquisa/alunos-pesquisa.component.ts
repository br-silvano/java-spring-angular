import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';

import { ConteudoService } from '../../../core/services/conteudo.service';
import { ToastyService } from '../../../core/services/toasty.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { AuthService } from '../../../core/services/auth.service';
import { AlunoFiltro, AlunoService } from '../../../core/services/aluno.service';
import { Aluno } from '../../../core/types/model';

@Component({
  selector: 'app-alunos-pesquisa',
  templateUrl: './alunos-pesquisa.component.html',
  styleUrls: ['./alunos-pesquisa.component.css']
})
export class AlunosPesquisaComponent implements OnInit {

  public loading = false;

  statuss = [
    { label: 'Ativo', value: true },
    { label: 'Inativo', value: false }
  ];

  totalRegistros = 0;
  filtro = new AlunoFiltro();
  alunos = [];
  @ViewChild('tabela') grid;

  pesquisaForm: FormGroup;

  constructor(
    private conteudo: ConteudoService,
    private auth: AuthService,
    private alunoService: AlunoService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    public title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.title.setTitle(this.conteudo.titulo('Alunos'));

    this.pesquisaForm = this.formBuilder.group({
      cpf: [''],
      nome: [''],
      ativo: [true]
    });
  }

  pesquisar() {
    const pesquisaForm = this.pesquisaForm.value;

    this.filtro.cpf = pesquisaForm.cpf;
    this.filtro.nome = pesquisaForm.nome;
    this.filtro.ativo = pesquisaForm.ativo;

    this.grid.first = 0;

    this.pesquisarAlunos();
  }

  pesquisarAlunos(pagina = 0) {
    setTimeout(() => {
      this.loading = true;
    });
    this.filtro.pagina = pagina;

    this.alunoService.pesquisar(this.filtro)
      .subscribe(resultado => {
        setTimeout(() => {
          this.loading = false;
        });
        this.totalRegistros = resultado.total;
        this.alunos = resultado.alunos;
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisarAlunos(pagina);
  }

  confirmarExclusao(aluno: Aluno) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(aluno);
      }
    });
  }

  excluir(aluno: Aluno) {
    setTimeout(() => {
      this.loading = true;
    });
    this.alunoService.excluir(aluno.id)
    .subscribe(() => {
      setTimeout(() => {
        this.loading = false;
      });
      if (this.grid.first === 0) {
        this.pesquisarAlunos();
      } else {
        this.grid.first = 0;
      }

      this.toasty.Success('Aluno excluído com sucesso!');
    }, erro => {
      setTimeout(() => {
        this.loading = false;
      });
      this.errorHandler.handle(erro);
    });
  }

  alternarStatus(aluno: Aluno): void {
    setTimeout(() => {
      this.loading = true;
    });
    const novoStatus = !aluno.ativo;

    this.alunoService.mudarStatus(aluno.id, novoStatus)
    .subscribe(() => {
      setTimeout(() => {
        this.loading = false;
      });
      const acao = novoStatus ? 'ativado' : 'desativado';

      aluno.ativo = novoStatus;
      this.toasty.Success(`Aluno ${acao} com sucesso!`);
    }, erro => {
      setTimeout(() => {
        this.loading = false;
      });
      this.errorHandler.handle(erro);
    });
  }

  temPermissao(permissao: string) {
    return this.auth.temPermissao(permissao);
  }

}
