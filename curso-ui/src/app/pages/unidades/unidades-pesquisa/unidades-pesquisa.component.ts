import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';

import { ConteudoService } from '../../../core/services/conteudo.service';
import { ToastyService } from '../../../core/services/toasty.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { AuthService } from '../../../core/services/auth.service';
import { UnidadeFiltro, UnidadeService } from '../../../core/services/unidade.service';
import { Unidade } from '../../../core/types/model';

@Component({
  selector: 'app-unidades-pesquisa',
  templateUrl: './unidades-pesquisa.component.html'
})
export class UnidadesPesquisaComponent implements OnInit {

  public loading = false;

  statuss = [
    { label: 'Ativo', value: true },
    { label: 'Inativo', value: false }
  ];

  totalRegistros = 0;
  filtro = new UnidadeFiltro();
  unidades = [];
  @ViewChild('tabela') grid;

  pesquisaForm: FormGroup;

  constructor(
    private conteudo: ConteudoService,
    private auth: AuthService,
    private unidadeService: UnidadeService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    public title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.title.setTitle(this.conteudo.titulo('Unidades'));

    this.pesquisaForm = this.formBuilder.group({
      codigo: [''],
      nome: [''],
      ativo: [true]
    });
  }

  pesquisar() {
    const pesquisaForm = this.pesquisaForm.value;

    this.filtro.codigo = pesquisaForm.codigo;
    this.filtro.nome = pesquisaForm.nome;
    this.filtro.ativo = pesquisaForm.ativo;

    this.grid.first = 0;

    this.pesquisarUnidades();
  }

  pesquisarUnidades(pagina = 0) {
    setTimeout(() => {
      this.loading = true;
    });
    this.filtro.pagina = pagina;

    this.unidadeService.pesquisar(this.filtro)
      .subscribe(resultado => {
        setTimeout(() => {
          this.loading = false;
        });
        this.totalRegistros = resultado.total;
        this.unidades = resultado.unidades;
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisarUnidades(pagina);
  }

  confirmarExclusao(unidade: Unidade) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(unidade);
      }
    });
  }

  excluir(unidade: Unidade) {
    setTimeout(() => {
      this.loading = true;
    });
    this.unidadeService.excluir(unidade.id)
    .subscribe(() => {
      setTimeout(() => {
        this.loading = false;
      });
      if (this.grid.first === 0) {
        this.pesquisarUnidades();
      } else {
        this.grid.first = 0;
      }

      this.toasty.Success('Unidade excluída com sucesso!');
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  alternarStatus(unidade: Unidade): void {
    setTimeout(() => {
      this.loading = true;
    });
    const novoStatus = !unidade.ativo;

    this.unidadeService.mudarStatus(unidade.id, novoStatus)
    .subscribe(() => {
      setTimeout(() => {
        this.loading = false;
      });
      const acao = novoStatus ? 'ativada' : 'desativada';

      unidade.ativo = novoStatus;
      this.toasty.Success(`Unidade ${acao} com sucesso!`);
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
