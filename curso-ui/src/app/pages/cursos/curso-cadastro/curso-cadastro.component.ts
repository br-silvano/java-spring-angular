import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { ConteudoService } from '../../../core/services/conteudo.service';
import { ToastyService } from '../../../core/services/toasty.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { AuthService } from '../../../core/services/auth.service';
import { CursoService } from '../../../core/services/curso.service';
import { Curso } from '../../../core/types/model';

@Component({
  selector: 'app-curso-cadastro',
  templateUrl: './curso-cadastro.component.html'
})
export class CursoCadastroComponent implements OnInit {

  public loading = false;

  curso = new Curso();
  cursoForm: FormGroup;
  dadosAlterados = false;

  constructor(
    private conteudo: ConteudoService,
    private auth: AuthService,
    private cursoService: CursoService,
    private toasty: ToastyService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    public title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.title.setTitle(this.conteudo.titulo('Novo Curso'));

    this.cursoForm = this.formBuilder.group({
      codigo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      descricao: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      valorMensalidade: ['', Validators.required]
    });

    const idCurso = this.route.snapshot.params['id'];

    if (idCurso) {
      this.title.setTitle(this.conteudo.titulo('Edição de Curso'));
      this.carregarCurso(idCurso);
    }

    this.onChanges();
  }

  get editando() {
    return Boolean(this.curso.id);
  }

  carregarCurso(id: number) {
    setTimeout(() => {
      this.loading = true;
    });
    this.cursoService.buscarPorId(id)
      .subscribe(curso => {
        setTimeout(() => {
          this.loading = false;
        });
        this.curso = curso;
        this.cursoForm.patchValue({
          codigo: curso.codigo,
          descricao: curso.descricao,
          valorMensalidade: curso.valorMensalidade
        }, { onlySelf: true, emitEvent: true });
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  salvar() {
    const curso = this.cursoForm.value as Curso;
    if (this.editando) {
      this.atualizarCurso(curso);
    } else {
      this.adicionarCurso(curso);
    }
  }

  adicionarCurso(curso: Curso) {
    setTimeout(() => {
      this.loading = true;
    });
    this.cursoService.adicionar(curso)
      .subscribe(cursoAdicionado => {
        setTimeout(() => {
          this.loading = false;
        });
        this.curso = cursoAdicionado;
        this.toasty.Success('Curso adicionado com sucesso!');
        this.dadosAlterados = false;
        this.router.navigate(['/cursos']);
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  atualizarCurso(curso: Curso) {
    setTimeout(() => {
      this.loading = true;
    });
    curso.id = this.curso.id;
    this.cursoService.atualizar(curso)
      .subscribe(cursoAlterado => {
        setTimeout(() => {
          this.loading = false;
        });
        this.curso = cursoAlterado;
        this.toasty.Success('Curso alterado com sucesso!');
        this.dadosAlterados = false;
        this.router.navigate(['/cursos']);
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  onChanges(): void {
    this.cursoForm.valueChanges.subscribe(() => {
      this.dadosAlterados = this.cursoForm.dirty;
    });
  }

  temPermissao(permissao: string) {
    return this.auth.temPermissao(permissao);
  }

}
