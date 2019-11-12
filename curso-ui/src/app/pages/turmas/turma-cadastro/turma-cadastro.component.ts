import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { ConteudoService } from '../../../core/services/conteudo.service';
import { ToastyService } from '../../../core/services/toasty.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { AuthService } from '../../../core/services/auth.service';
import { CalendarService } from '../../../core/services/calendar.service';
import { StatusTurmaService } from '../../../core/services/status-turma.service';
import { TurmaService } from '../../../core/services/turma.service';
import { UnidadeService } from '../../../core/services/unidade.service';
import { CursoService } from '../../../core/services/curso.service';
import { TurnoService } from '../../../core/services/turno.service';

import { Turma } from '../../../core/types/model';

@Component({
  selector: 'app-turma-cadastro',
  templateUrl: './turma-cadastro.component.html'
})
export class TurmaCadastroComponent implements OnInit {

  public loading = false;

  turma: Turma = new Turma();
  turmaForm: FormGroup;
  dadosAlterados = false;
  calendarLocale: any;

  unidades = [];
  cursos = [];
  turnos = [];
  statuss = [];

  constructor(
    private conteudo: ConteudoService,
    private auth: AuthService,
    private statusTurmaService: StatusTurmaService,
    private turmaService: TurmaService,
    private unidadeService: UnidadeService,
    private cursoService: CursoService,
    private turnoService: TurnoService,
    private toasty: ToastyService,
    private errorHandler: ErrorHandlerService,
    private calendar: CalendarService,
    private route: ActivatedRoute,
    private router: Router,
    public title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.title.setTitle(this.conteudo.titulo('Nova Turma'));

    this.turmaForm = this.formBuilder.group({
      codigo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      unidade: this.formBuilder.group({
        id: ['', [Validators.required]]
      }),
      curso: this.formBuilder.group({
        id: ['', [Validators.required]]
      }),
      turno: this.formBuilder.group({
        id: ['', [Validators.required]]
      }),
      horaInicio: ['', [Validators.required]],
      horaTermino: ['', [Validators.required]],
      statusTurma: this.formBuilder.group({
        id: [1, [Validators.required]]
      })
    });

    this.calendarLocale = this.calendar.locale();
    const idTurma = this.route.snapshot.params['id'];

    if (idTurma) {
      this.title.setTitle(this.conteudo.titulo('Edição de Turma'));
      this.carregarTurma(idTurma);
    }

    this.carregarUnidades();
    this.carregarCursos();
    this.carregarTurnos();
    this.carregarStatuss();

    this.onChanges();
  }

  carregarUnidades() {
    setTimeout(() => {
      this.loading = true;
    });
    this.unidadeService.listarTodas()
      .subscribe(unidades => {
        setTimeout(() => {
          this.loading = false;
        });
        if (unidades.totalElements > 0) {
          this.unidades = unidades.content
          .map(p => ({ label: p.nome + ' - ' + p.codigo, value: p.id }));
        }
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  carregarCursos() {
    setTimeout(() => {
      this.loading = true;
    });
    this.cursoService.listarTodos()
      .subscribe(cursos => {
        setTimeout(() => {
          this.loading = false;
        });
        if (cursos.totalElements > 0) {
          this.cursos = cursos.content
          .map(p => ({ label: p.descricao + ' - ' + p.codigo, value: p.id }));
        }
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  carregarTurnos() {
    setTimeout(() => {
      this.loading = true;
    });
    this.turnoService.listarTodos()
      .subscribe(turnos => {
        setTimeout(() => {
          this.loading = false;
        });
        if (turnos.totalElements > 0) {
          this.turnos = turnos.content
            .map(p => ({ label: p.descricao + ' - ' + p.codigo, value: p.id }));
        }
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
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

  get editando() {
    return Boolean(this.turma.id);
  }

  carregarTurma(id: number) {
    setTimeout(() => {
      this.loading = true;
    });
    this.turmaService.buscarPorId(id)
      .subscribe(turma => {
        setTimeout(() => {
          this.loading = false;
        });
        this.turma = turma;
        this.turmaForm.patchValue({
          unidade: { id: turma.unidade.id },
          codigo: turma.codigo,
          nome: turma.nome,
          curso: { id: turma.curso.id },
          turno: { id: turma.turno.id },
          horaInicio: turma.horaInicio,
          horaTermino: turma.horaTermino,
          statusTurma: { id : turma.statusTurma.id }
        }, { onlySelf: true, emitEvent: true });
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  salvar() {
    const turma = this.turmaForm.value as Turma;
    if (this.editando) {
      this.atualizarTurma(turma);
    } else {
      this.adicionarTurma(turma);
    }
  }

  adicionarTurma(turma: Turma) {
    setTimeout(() => {
      this.loading = true;
    });
    this.turmaService.adicionar(turma)
      .subscribe(turmaAdicionada => {
        setTimeout(() => {
          this.loading = false;
        });
        this.turma = turmaAdicionada;
        this.toasty.Success('Turma adicionada com sucesso!');
        this.dadosAlterados = false;
        this.router.navigate(['/turmas']);
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  atualizarTurma(turma: Turma) {
    setTimeout(() => {
      this.loading = true;
    });
    turma.id = this.turma.id;
    this.turmaService.atualizar(turma)
      .subscribe(turmaAlterada => {
        setTimeout(() => {
          this.loading = false;
        });
        this.turma = turmaAlterada;
        this.toasty.Success('Turma alterada com sucesso!');
        this.dadosAlterados = false;
        this.router.navigate(['/turmas']);
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  onChanges(): void {
    this.turmaForm.valueChanges.subscribe(() => {
      this.dadosAlterados = this.turmaForm.dirty;
    });
  }

  temPermissao(permissao: string) {
    return this.auth.temPermissao(permissao);
  }

}
