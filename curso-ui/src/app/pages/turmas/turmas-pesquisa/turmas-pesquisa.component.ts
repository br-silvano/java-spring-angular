import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';

import { ConteudoService } from '../../../core/services/conteudo.service';
import { ToastyService } from '../../../core/services/toasty.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { AuthService } from '../../../core/services/auth.service';
import { StatusTurmaService } from '../../../core/services/status-turma.service';
import { TurmaFiltro, TurmaService } from '../../../core/services/turma.service';
import { Turma } from '../../../core/types/model';

@Component({
  selector: 'app-turmas-pesquisa',
  templateUrl: './turmas-pesquisa.component.html',
  styleUrls: ['./turmas-pesquisa.component.css']
})
export class TurmasPesquisaComponent implements OnInit {

  public loading = false;

  totalRegistros = 0;
  filtro = new TurmaFiltro();
  statuss = [];
  turmas = [];
  @ViewChild('tabela') grid;

  pesquisaForm: FormGroup;

  status = 1;

  constructor(
    private conteudo: ConteudoService,
    private auth: AuthService,
    private statusTurmaService: StatusTurmaService,
    private turmaService: TurmaService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    public title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.title.setTitle(this.conteudo.titulo('Turmas'));

    this.pesquisaForm = this.formBuilder.group({
      codigo: [''],
      nome: [''],
      statusTurma: this.formBuilder.group({
        id: [this.status],
      })
    });

    this.filtro.statusTurma.id = this.status;

    this.carregarStatuss();
  }

  carregarStatuss() {
    setTimeout(() => {
      this.loading = true;
    });
    this.statusTurmaService.listarTodos()
      .subscribe(statuss => {
        setTimeout(() => {
          this.loading = false;
        });
        this.statuss = statuss
        .map(p => ({ label: p.descricao, value: p.id }));
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  pesquisar() {
    const pesquisaForm = this.pesquisaForm.value as TurmaFiltro;
    this.filtro.nome = pesquisaForm.nome;
    this.filtro.statusTurma = pesquisaForm.statusTurma;

    this.grid.first = 0;

    this.pesquisarTurmas();
  }

  pesquisarTurmas(pagina = 0) {
    setTimeout(() => {
      this.loading = true;
    });
    this.filtro.pagina = pagina;

    this.turmaService.pesquisar(this.filtro)
      .subscribe(resultado => {
        setTimeout(() => {
          this.loading = false;
        });
        this.totalRegistros = resultado.total;
        this.turmas = resultado.turmas;
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisarTurmas(pagina);
  }

  confirmarExclusao(turma: Turma) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(turma);
      }
    });
  }

  excluir(turma: Turma) {
    setTimeout(() => {
      this.loading = true;
    });
    this.turmaService.excluir(turma.id)
    .subscribe(() => {
      setTimeout(() => {
        this.loading = false;
      });
      if (this.grid.first === 0) {
        this.pesquisarTurmas();
      } else {
        this.grid.first = 0;
      }

      this.toasty.Success('Turma excluída com sucesso!');
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
