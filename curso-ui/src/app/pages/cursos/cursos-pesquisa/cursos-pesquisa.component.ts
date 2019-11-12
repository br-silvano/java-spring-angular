import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';

import { ConteudoService } from '../../../core/services/conteudo.service';
import { ToastyService } from '../../../core/services/toasty.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { AuthService } from '../../../core/services/auth.service';
import { CursoFiltro, CursoService } from '../../../core/services/curso.service';
import { Curso } from '../../../core/types/model';

@Component({
  selector: 'app-cursos-pesquisa',
  templateUrl: './cursos-pesquisa.component.html',
  styleUrls: ['./cursos-pesquisa.component.css']
})
export class CursosPesquisaComponent implements OnInit {

  public loading = false;

  statuss = [
    { label: 'Ativo', value: true },
    { label: 'Inativo', value: false }
  ];

  totalRegistros = 0;
  filtro = new CursoFiltro();
  cursos = [];
  @ViewChild('tabela') grid;

  pesquisaForm: FormGroup;

  constructor(
    private conteudo: ConteudoService,
    private auth: AuthService,
    private cursoService: CursoService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    public title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.title.setTitle(this.conteudo.titulo('Cursos'));

    this.pesquisaForm = this.formBuilder.group({
      codigo: [''],
      descricao: [''],
      ativo: [true]
    });
  }

  pesquisar() {
    const pesquisaForm = this.pesquisaForm.value;

    this.filtro.codigo = pesquisaForm.codigo;
    this.filtro.descricao = pesquisaForm.descricao;
    this.filtro.ativo = pesquisaForm.ativo;

    this.grid.first = 0;

    this.pesquisarCursos();
  }

  pesquisarCursos(pagina = 0) {
    setTimeout(() => {
      this.loading = true;
    });
    this.filtro.pagina = pagina;

    this.cursoService.pesquisar(this.filtro)
      .subscribe(resultado => {
        setTimeout(() => {
          this.loading = false;
        });
        this.totalRegistros = resultado.total;
        this.cursos = resultado.cursos;
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisarCursos(pagina);
  }

  confirmarExclusao(curso: Curso) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(curso);
      }
    });
  }

  excluir(curso: Curso) {
    setTimeout(() => {
      this.loading = true;
    });
    this.cursoService.excluir(curso.id)
    .subscribe(() => {
      setTimeout(() => {
        this.loading = false;
      });
      if (this.grid.first === 0) {
        this.pesquisarCursos();
      } else {
        this.grid.first = 0;
      }

      this.toasty.Success('Curso excluído com sucesso!');
    }, erro => {
      setTimeout(() => {
        this.loading = false;
      });
      this.errorHandler.handle(erro);
    });
  }

  alternarStatus(curso: Curso): void {
    setTimeout(() => {
      this.loading = true;
    });
    const novoStatus = !curso.ativo;

    this.cursoService.mudarStatus(curso.id, novoStatus)
    .subscribe(() => {
      setTimeout(() => {
        this.loading = false;
      });
      const acao = novoStatus ? 'ativado' : 'desativado';

      curso.ativo = novoStatus;
      this.toasty.Success(`Curso ${acao} com sucesso!`);
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
