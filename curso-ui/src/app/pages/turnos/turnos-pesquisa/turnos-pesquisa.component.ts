import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';

import { ConteudoService } from '../../../core/services/conteudo.service';
import { ToastyService } from '../../../core/services/toasty.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { AuthService } from '../../../core/services/auth.service';
import { TurnoFiltro, TurnoService } from '../../../core/services/turno.service';
import { Turno } from '../../../core/types/model';

@Component({
  selector: 'app-turnos-pesquisa',
  templateUrl: './turnos-pesquisa.component.html'
})
export class TurnosPesquisaComponent implements OnInit {

  public loading = false;

  statuss = [
    { label: 'Ativo', value: true },
    { label: 'Inativo', value: false }
  ];

  totalRegistros = 0;
  filtro = new TurnoFiltro();
  turnos = [];
  @ViewChild('tabela') grid;

  pesquisaForm: FormGroup;

  constructor(
    private conteudo: ConteudoService,
    private auth: AuthService,
    private turnoService: TurnoService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    public title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.title.setTitle(this.conteudo.titulo('Turnos'));

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

    this.pesquisarTurnos();
  }

  pesquisarTurnos(pagina = 0) {
    setTimeout(() => {
      this.loading = true;
    });
    this.filtro.pagina = pagina;

    this.turnoService.pesquisar(this.filtro)
      .subscribe(resultado => {
        setTimeout(() => {
          this.loading = false;
        });
        this.totalRegistros = resultado.total;
        this.turnos = resultado.turnos;
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisarTurnos(pagina);
  }

  confirmarExclusao(turno: Turno) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(turno);
      }
    });
  }

  excluir(turno: Turno) {
    setTimeout(() => {
      this.loading = true;
    });
    this.turnoService.excluir(turno.id)
    .subscribe(() => {
      setTimeout(() => {
        this.loading = false;
      });
      if (this.grid.first === 0) {
        this.pesquisarTurnos();
      } else {
        this.grid.first = 0;
      }

      this.toasty.Success('Turno excluído com sucesso!');
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  alternarStatus(turno: Turno): void {
    setTimeout(() => {
      this.loading = true;
    });
    const novoStatus = !turno.ativo;

    this.turnoService.mudarStatus(turno.id, novoStatus)
    .subscribe(() => {
      setTimeout(() => {
        this.loading = false;
      });
      const acao = novoStatus ? 'ativado' : 'desativado';

      turno.ativo = novoStatus;
      this.toasty.Success(`Turno ${acao} com sucesso!`);
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
