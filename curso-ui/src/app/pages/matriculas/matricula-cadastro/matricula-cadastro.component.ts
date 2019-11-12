import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { ConteudoService } from '../../../core/services/conteudo.service';
import { ToastyService } from '../../../core/services/toasty.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { AuthService } from '../../../core/services/auth.service';
import { StatusMatriculaService } from '../../../core/services/status-matricula.service';
import { MatriculaService } from '../../../core/services/matricula.service';
import { TurmaService } from '../../../core/services/turma.service';
import { AlunoService } from '../../../core/services/aluno.service';

import { Matricula } from '../../../core/types/model';

@Component({
  selector: 'app-matricula-cadastro',
  templateUrl: './matricula-cadastro.component.html'
})
export class MatriculaCadastroComponent implements OnInit {

  public loading = false;

  matricula: Matricula = new Matricula();
  matriculaForm: FormGroup;
  dadosAlterados = false;

  turmas = [];
  alunos = [];
  statuss = [];

  constructor(
    private conteudo: ConteudoService,
    private auth: AuthService,
    private statusMatriculaService: StatusMatriculaService,
    private matriculaService: MatriculaService,
    private turmaService: TurmaService,
    private alunoService: AlunoService,
    private toasty: ToastyService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    public title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.title.setTitle(this.conteudo.titulo('Nova Matrícula'));

    this.matriculaForm = this.formBuilder.group({
      aluno: this.formBuilder.group({
        id: ['', [Validators.required]]
      }),
      turma: this.formBuilder.group({
        id: ['', [Validators.required]]
      }),
      valorMensalidade: [0, [Validators.required]],
      percentualDesconto: [0, [Validators.required]],
      valorDesconto: [0, [Validators.required]],
      diaPagamento: [15, [Validators.required]],
      statusMatricula: this.formBuilder.group({
        id: [1, [Validators.required]]
      })
    });

    const idMatricula = this.route.snapshot.params['id'];

    if (idMatricula) {
      this.title.setTitle(this.conteudo.titulo('Edição de Matrícula'));
      this.carregarMatricula(idMatricula);
    }

    this.carregarAlunos();
    this.carregarTurmas();
    this.carregarStatuss();

    this.onChanges();
  }

  carregarAlunos() {
    setTimeout(() => {
      this.loading = true;
    });
    this.alunoService.listarTodos()
      .subscribe(alunos => {
        setTimeout(() => {
          this.loading = false;
        });
        if (alunos.totalElements > 0) {
          this.alunos = alunos.content
          .map(p => ({ label: p.nome + ' - ' + p.cpf, value: p.id }));
        }
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  carregarTurmas() {
    setTimeout(() => {
      this.loading = true;
    });
    this.turmaService.listarTodas()
      .subscribe(turmas => {
        setTimeout(() => {
          this.loading = false;
        });
        if (turmas.totalElements > 0) {
          this.turmas = turmas.content
          .map(p => ({ label: p.nome + ' - ' + p.codigo, value: p.id }));
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
    this.statusMatriculaService.listarTodos()
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
    return Boolean(this.matricula.id);
  }

  carregarMatricula(id: number) {
    setTimeout(() => {
      this.loading = true;
    });
    this.matriculaService.buscarPorId(id)
      .subscribe(matricula => {
        setTimeout(() => {
          this.loading = false;
        });
        this.matricula = matricula;
        this.matriculaForm.patchValue({
          aluno: { id: matricula.aluno.id },
          turma: { id: matricula.turma.id },
          valorMensalidade: matricula.valorMensalidade,
          percentualDesconto: matricula.percentualDesconto,
          valorDesconto: matricula.valorDesconto,
          diaPagamento: matricula.diaPagamento,
          statusMatricula: { id : matricula.statusMatricula.id }
        }, { onlySelf: true, emitEvent: true });
        this.CalculaPercentualDesconto();
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  salvar() {
    const matricula = this.matriculaForm.value as Matricula;
    matricula.diaPagamento = matricula.diaPagamento;
    if (this.editando) {
      this.atualizarMatricula(matricula);
    } else {
      this.adicionarMatricula(matricula);
    }
  }

  adicionarMatricula(matricula: Matricula) {
    setTimeout(() => {
      this.loading = true;
    });
    this.matriculaService.adicionar(matricula)
      .subscribe(matriculaAdicionada => {
        setTimeout(() => {
          this.loading = false;
        });
        this.toasty.Success(`Matrícula ${matriculaAdicionada.id} adicionada com sucesso!`);
        this.dadosAlterados = false;
        this.router.navigate(['/matriculas']);
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  atualizarMatricula(matricula: Matricula) {
    setTimeout(() => {
      this.loading = true;
    });
    matricula.id = this.matricula.id;
    this.matriculaService.atualizar(matricula)
      .subscribe(matriculaAtualizada => {
        setTimeout(() => {
          this.loading = false;
        });
        this.matricula = matriculaAtualizada;
        this.toasty.Success('Matrícula alterada com sucesso!');
        this.dadosAlterados = false;
        this.router.navigate(['/matriculas']);
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  onChanges(): void {
    this.matriculaForm.valueChanges.subscribe(() => {
      this.dadosAlterados = this.matriculaForm.dirty;
    });

    this.matriculaForm.get('valorMensalidade').valueChanges.subscribe(() => {
      this.CalculaPercentualDesconto();
    });
    this.matriculaForm.get('percentualDesconto').valueChanges.subscribe(() => {
      this.CalculaPercentualDesconto();
    });
  }

  CalculaPercentualDesconto() {
    this.matriculaForm.get('valorDesconto').setValue(this.matriculaForm.get('valorMensalidade').value
      - ((this.matriculaForm.get('valorMensalidade').value * this.matriculaForm.get('percentualDesconto').value) / 100));
  }

  temPermissao(permissao: string) {
    return this.auth.temPermissao(permissao);
  }

}
