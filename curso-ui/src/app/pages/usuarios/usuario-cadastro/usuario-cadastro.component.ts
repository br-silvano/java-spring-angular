import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { ConteudoService } from '../../../core/services/conteudo.service';
import { ToastyService } from '../../../core/services/toasty.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { PermissaoService } from '../../../core/services/permissao.service';
import { UnidadeService } from '../../../core/services/unidade.service';
import { Usuario } from '../../../core/types/model';
import { EmailPattern } from './../../../core/validators/email';
import { SenhaPattern } from './../../../core/validators/senha';

@Component({
  selector: 'app-usuario-cadastro',
  templateUrl: './usuario-cadastro.component.html'
})
export class UsuarioCadastroComponent implements OnInit {

  public loading = false;

  usuario = new Usuario();
  usuarioForm: FormGroup;
  dadosAlterados = false;

  permissoes = [];
  unidades = [];

  constructor(
    private conteudo: ConteudoService,
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private permissaoService: PermissaoService,
    private unidadeService: UnidadeService,
    private toasty: ToastyService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    public title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.title.setTitle(this.conteudo.titulo('Novo Usuário'));

    const idUsuario = this.route.snapshot.params['id'];

    if (!idUsuario) {
      this.usuarioForm = this.formBuilder.group({
        nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
        email: ['', [
          Validators.required, Validators.pattern(EmailPattern()), Validators.minLength(5), Validators.maxLength(50)]
        ],
        senha: ['', [Validators.required, Validators.pattern(SenhaPattern())]],
        permissoes: [this.permissoes, [Validators.required]],
        unidades: [this.unidades]
      });
    } else {
      this.usuarioForm = this.formBuilder.group({
        nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
        email: ['', [
          Validators.required, Validators.pattern(EmailPattern()), Validators.minLength(5), Validators.maxLength(50)]
        ],
        senha: [''],
        permissoes: [this.permissoes, [Validators.required]],
        unidades: [this.unidades]
      });
    }

    if (idUsuario) {
      this.title.setTitle(this.conteudo.titulo('Edição de Usuário'));
      this.carregarUsuario(idUsuario);
    }

    this.carregarPermissoes();
    this.carregarUnidades();

    this.onChanges();
  }

  get editando() {
    return Boolean(this.usuario.id);
  }

  carregarUsuario(id: number) {
    setTimeout(() => {
      this.loading = true;
    });
    this.usuarioService.buscarPorId(id)
      .subscribe(usuario => {
        setTimeout(() => {
          this.loading = false;
        });
        this.usuario = usuario;
        this.usuarioForm.patchValue({
          nome: usuario.nome,
          email: usuario.email,
          senha: '',
          permissoes: usuario.permissoes.map(permissao => (permissao.id)),
          unidades: usuario.unidades.map(unidade => (unidade.id))
        }, { onlySelf: true, emitEvent: true });
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  carregarPermissoes() {
    setTimeout(() => {
      this.loading = true;
    });
    return this.permissaoService.listarTodas()
      .subscribe(permissoes => {
        setTimeout(() => {
          this.loading = false;
        });
        this.permissoes = permissoes
          .map(m => ({ value: m.id, label: m.descricao }));
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  carregarUnidades() {
    setTimeout(() => {
      this.loading = true;
    });
    return this.unidadeService.listarTodas()
      .subscribe(unidades => {
        setTimeout(() => {
          this.loading = false;
        });
        this.unidades = unidades.content
          .map(m => ({ value: m.id, label: m.nome }));
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  salvar() {
    const usuario = this.usuarioForm.value as Usuario;
    usuario.permissoes = this.usuarioForm.get('permissoes').value.map(m => ({id: m}));
    usuario.unidades = this.usuarioForm.get('unidades').value.map(m => ({id: m}));
    if (this.editando) {
      this.atualizarUsuario(usuario);
    } else {
      this.adicionarUsuario(usuario);
    }
  }

  adicionarUsuario(usuario: Usuario) {
    setTimeout(() => {
      this.loading = true;
    });
    this.usuarioService.adicionar(usuario)
      .subscribe(usuarioAdicionado => {
        setTimeout(() => {
          this.loading = false;
        });
        this.usuario = usuarioAdicionado;
        this.usuarioForm.reset();
        this.toasty.Success('Usuário adicionado com sucesso!');
        this.dadosAlterados = false;
        this.router.navigate(['/usuarios']);
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  atualizarUsuario(usuario: Usuario) {
    setTimeout(() => {
      this.loading = true;
    });
    usuario.id = this.usuario.id;
    this.usuarioService.atualizar(usuario)
      .subscribe(usuarioAlterado => {
        setTimeout(() => {
          this.loading = false;
        });
        this.usuario = usuarioAlterado;
        this.usuarioForm.reset();
        this.toasty.Success('Usuário alterado com sucesso!');
        this.dadosAlterados = false;
        this.router.navigate(['/usuarios']);
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  onChanges(): void {
    this.usuarioForm.valueChanges.subscribe(() => {
      this.dadosAlterados = this.usuarioForm.dirty;
    });
  }

  temPermissao(permissao: string) {
    return this.auth.temPermissao(permissao);
  }

}
