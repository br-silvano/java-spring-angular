import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';

import { ConteudoService } from '../../../core/services/conteudo.service';
import { ToastyService } from '../../../core/services/toasty.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { AuthService } from '../../../core/services/auth.service';
import { StatusMatriculaService } from '../../../core/services/status-matricula.service';
import { MatriculaFiltro, MatriculaService } from '../../../core/services/matricula.service';
import { Matricula, StatusMatricula } from '../../../core/types/model';

@Component({
  selector: 'app-matriculas-pesquisa',
  templateUrl: './matriculas-pesquisa.component.html',
  styleUrls: ['./matriculas-pesquisa.component.css']
})
export class MatriculasPesquisaComponent implements OnInit {

  public loading = false;

  totalRegistros = 0;
  filtro: MatriculaFiltro = new MatriculaFiltro();
  statuss = [];
  matriculas: Matricula[] = [];
  @ViewChild('tabela') grid;

  pesquisaForm: FormGroup;

  status = 1;

  constructor(
    private conteudo: ConteudoService,
    private auth: AuthService,
    private statusMatriculaService: StatusMatriculaService,
    private matriculaService: MatriculaService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    public title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.title.setTitle(this.conteudo.titulo('Matriculas'));

    this.pesquisaForm = this.formBuilder.group({
      id: [''],
      cpf: [''],
      statusMatricula: this.formBuilder.group({
        id: [this.status],
      })
    });

    this.filtro.statusMatricula.id = this.status;

    this.carregarStatuss();
  }

  carregarStatuss() {
    setTimeout(() => {
      this.loading = true;
    });
    this.statusMatriculaService.listarTodos()
      .subscribe((statuss: StatusMatricula[]) => {
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
    const pesquisaForm = this.pesquisaForm.value as MatriculaFiltro;
    this.filtro.id = pesquisaForm.id;
    this.filtro.cpf = pesquisaForm.cpf;
    this.filtro.statusMatricula = pesquisaForm.statusMatricula;

    this.grid.first = 0;

    this.pesquisarMatriculas();
  }

  pesquisarMatriculas(pagina = 0) {
    this.filtro.pagina = pagina;

    this.matriculaService.pesquisar(this.filtro)
      .subscribe(resultado => {
        this.totalRegistros = resultado.total;
        this.matriculas = resultado.matriculas;
      }, erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisarMatriculas(pagina);
  }

  confirmarExclusao(matricula: Matricula) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(matricula);
      }
    });
  }

  excluir(matricula: Matricula) {
    setTimeout(() => {
      this.loading = true;
    });
    this.matriculaService.excluir(matricula.id)
    .subscribe(() => {
      setTimeout(() => {
        this.loading = false;
      });
      if (this.grid.first === 0) {
        this.pesquisarMatriculas();
      } else {
        this.grid.first = 0;
      }

      this.toasty.Success('Matricula excluída com sucesso!');
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
