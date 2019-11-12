import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';

import { ConteudoService } from '../../../core/services/conteudo.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';

import { AlteraSenha } from '../../../core/types/model';
import { SenhaPattern } from '../../../core/validators/senha';

@Component({
  selector: 'app-perfil-altera-senha',
  templateUrl: './perfil-altera-senha.component.html'
})
export class PerfilAlteraSenhaComponent implements OnInit {

  public loading = false;

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
    private usuario: UsuarioService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    public title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.title.setTitle(this.conteudo.titulo('Alterar Senha'));

    this.alteraSenhaForm = this.formBuilder.group({
      senha: ['', [Validators.required]],
      novaSenha: ['', [Validators.required, Validators.pattern(SenhaPattern())]],
      confirmaNovaSenha: ['', [Validators.required]],
    }, {validator: PerfilAlteraSenhaComponent.equalsTo});
  }

  alterar() {
    setTimeout(() => {
      this.loading = true;
    });
    const alteraSenha = this.alteraSenhaForm.value as AlteraSenha;
    this.alteraSenhaForm.reset();
    this.usuario.alterarMinhaSenha(alteraSenha)
      .subscribe(() => {
        setTimeout(() => {
          this.loading = false;
        });
        this.auth.limparAccessToken();
        this.router.navigate(['/login']);
      }, erro => {
        setTimeout(() => {
          this.loading = false;
        });
        this.errorHandler.handle(erro);
      });
  }

}
