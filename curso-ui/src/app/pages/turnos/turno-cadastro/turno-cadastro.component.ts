import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { ConteudoService } from '../../../core/services/conteudo.service';
import { ToastyService } from '../../../core/services/toasty.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { AuthService } from '../../../core/services/auth.service';
import { TurnoService } from '../../../core/services/turno.service';
import { Turno } from '../../../core/types/model';

@Component({
  selector: 'app-turno-cadastro',
  templateUrl: './turno-cadastro.component.html'
})
export class TurnoCadastroComponent implements OnInit {

  public loading = false;

  turno = new Turno();
  turnoForm: FormGroup;
  dadosAlterados = false;

  constructor(
    private conteudo: ConteudoService,
    private auth: AuthService,
    private turnoService: TurnoService,
    private toasty: ToastyService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    public title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.title.setTitle(this.conteudo.titulo('Novo Turno'));

    this.turnoForm = this.formBuilder.group({
      codigo: ['', [Validators.required, Validators.maxLength(10)]],
      descricao: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]]
    });

    const idTurno = this.route.snapshot.params['id'];

    if (idTurno) {
      this.title.setTitle(this.conteudo.titulo('Edição de Turno'));
      this.carregarTurno(idTurno);
    }

    this.onChanges();
  }

  get editando() {
    return Boolean(this.turno.id)
  }

  carregarTurno(id: number) {
    setTimeout(() => {
      this.loading = true;
    });
    this.turnoService.buscarPorId(id)
      .subscribe(turno => {
        setTimeout(() => {
          this.loading = false;
        });
        this.turno = turno;
        this.turnoForm.patchValue({
          codigo: turno.codigo,
          descricao: turno.descricao
        }, { onlySelf: true, emitEvent: true });
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  salvar() {
    const unidade = this.turnoForm.value as Turno;
    if (this.editando) {
      this.atualizarTurno(unidade);
    } else {
      this.adicionarTurno(unidade);
    }
  }

  adicionarTurno(turno: Turno) {
    setTimeout(() => {
      this.loading = true;
    });
    this.turnoService.adicionar(turno)
      .subscribe(turnoAdicionado => {
        setTimeout(() => {
          this.loading = false;
        });
        this.turno = turnoAdicionado;
        this.toasty.Success('Turno adicionado com sucesso!');
        this.dadosAlterados = false;
        this.router.navigate(['/turnos']);
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  atualizarTurno(turno: Turno) {
    setTimeout(() => {
      this.loading = true;
    });
    turno.id = this.turno.id;
    this.turnoService.atualizar(turno)
      .subscribe(turnoAlterado => {
        setTimeout(() => {
          this.loading = false;
        });
        this.turno = turnoAlterado;
        this.toasty.Success('Turno alterado com sucesso!');
        this.dadosAlterados = false;
        this.router.navigate(['/turnos']);
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  onChanges(): void {
    this.turnoForm.valueChanges.subscribe(() => {
      this.dadosAlterados = this.turnoForm.dirty;
    });
  }

  temPermissao(permissao: string) {
    return this.auth.temPermissao(permissao);
  }

}
