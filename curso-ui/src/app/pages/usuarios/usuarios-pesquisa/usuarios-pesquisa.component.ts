import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';

import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';

import { ConteudoService } from '../../../core/services/conteudo.service';
import { ToastyService } from '../../../core/services/toasty.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioFiltro, UsuarioService } from '../../../core/services/usuario.service';
import { Usuario, AlteraSenha } from '../../../core/types/model';
import { SenhaPattern } from './../../../core/validators/senha';

@Component({
  selector: 'app-usuarios-pesquisa',
  templateUrl: './usuarios-pesquisa.component.html',
  styleUrls: ['./usuarios-pesquisa.component.css']
})
export class UsuariosPesquisaComponent implements OnInit {

  public loading = false;

  statuss = [
    { label: 'Ativo', value: true },
    { label: 'Inativo', value: false }
  ];

  totalRegistros = 0;
  filtro = new UsuarioFiltro();
  usuarios = [];
  @ViewChild('tabela') grid;

  pesquisaForm: FormGroup;

  idUsuarioAltereSenha: number;
  displayAlteraSenha = false;
  alteraSenhaForm: FormGroup;

  static equalsTo(group: AbstractControl): {[key: string]: boolean} {
    const novaSenha = group.get('novaSenha');
    const confirmaNovaSenha = group.get('confirmaNovaSenha');
    if (!novaSenha || !confirmaNovaSenha) {
      return undefined;
    }
    if (novaSenha.value !== confirmaNovaSenha.value) {
      return {senhasNotMatch: true};
    }
    return undefined;
  }

  constructor(
    private conteudo: ConteudoService,
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    public title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.title.setTitle(this.conteudo.titulo('Usuários'));

    this.pesquisaForm = this.formBuilder.group({
      nome: [''],
      ativo: [true]
    });

    this.alteraSenhaForm = this.formBuilder.group({
      novaSenha: ['', [Validators.required, Validators.pattern(SenhaPattern())]],
      confirmaNovaSenha: ['', [Validators.required]],
    }, {validator: UsuariosPesquisaComponent.equalsTo});
  }

  pesquisar() {
    const pesquisaForm = this.pesquisaForm.value;

    this.filtro.nome = pesquisaForm.nome;
    this.filtro.ativo = pesquisaForm.ativo;

    this.grid.first = 0;

    this.pesquisarUsuarios();
  }

  pesquisarUsuarios(pagina = 0) {
    setTimeout(() => {
      this.loading = true;
    });
    this.filtro.pagina = pagina;

    this.usuarioService.pesquisar(this.filtro)
      .subscribe(resultado => {
        setTimeout(() => {
          this.loading = false;
        });
        this.totalRegistros = resultado.total;
        this.usuarios = resultado.usuarios;
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisarUsuarios(pagina);
  }

  confirmarExclusao(usuario: Usuario) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(usuario);
      }
    });
  }

  excluir(usuario: Usuario) {
    setTimeout(() => {
      this.loading = true;
    });
    this.usuarioService.excluir(usuario.id)
      .subscribe(() => {
        setTimeout(() => {
          this.loading = false;
        });
        if (this.grid.first === 0) {
          this.pesquisarUsuarios();
        } else {
          this.grid.first = 0;
        }

        this.toasty.Success('Usuario excluído com sucesso!');
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

  alternarStatus(usuario: Usuario): void {
    setTimeout(() => {
      this.loading = true;
    });
    const novoStatus = !usuario.ativo;

    this.usuarioService.mudarStatus(usuario.id, novoStatus)
      .subscribe(() => {
        setTimeout(() => {
          this.loading = false;
        });
        const acao = novoStatus ? 'ativado' : 'desativado';

        usuario.ativo = novoStatus;
        this.toasty.Success(`Usuário ${acao} com sucesso!`);
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

  showDialogAlteraSenha(id: number) {
    this.idUsuarioAltereSenha = id;
    this.displayAlteraSenha = true;
  }

  alterarSenha() {
    this.loading = true;
    const alteraSenha = this.alteraSenhaForm.value as AlteraSenha;
    this.alteraSenhaForm.reset();
    this.usuarioService.alterarSenha(this.idUsuarioAltereSenha, alteraSenha)
      .subscribe(() => {
        this.loading = false;
        this.displayAlteraSenha = false;
        this.toasty.Success('Senha alterada com sucesso!');
      }, erro => {
        this.loading = false;
        this.errorHandler.handle(erro, true);
      });
  }

}
