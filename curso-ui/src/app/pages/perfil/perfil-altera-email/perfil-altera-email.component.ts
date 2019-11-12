import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';

import { ConteudoService } from '../../../core/services/conteudo.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';

import { AlteraEmail } from '../../../core/types/model';
import { EmailPattern } from '../../../core/validators/email';

@Component({
  selector: 'app-perfil-altera-email',
  templateUrl: './perfil-altera-email.component.html'
})
export class PerfilAlteraEmailComponent implements OnInit {

  public loading = false;

  alteraEmailForm: FormGroup;

  static equalsTo(group: AbstractControl): {[key: string]: boolean} {
    const novoEmail = group.get('novoEmail');
    const confirmaNovoEmail = group.get('confirmaNovoEmail');
    if (!novoEmail || !confirmaNovoEmail) {
      return undefined;
    }
    if (novoEmail.value !== confirmaNovoEmail.value) {
      return {emailsNotMatch: true};
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
    this.title.setTitle(this.conteudo.titulo('Alterar E-mail'));

    this.alteraEmailForm = this.formBuilder.group({
      senha: ['', [Validators.required]],
      novoEmail: ['', [Validators.required, Validators.pattern(EmailPattern())]],
      confirmaNovoEmail: ['', [Validators.required]],
    }, {validator: PerfilAlteraEmailComponent.equalsTo});
  }

  alterar() {
    setTimeout(() => {
      this.loading = true;
    });
    const alteraEmail = this.alteraEmailForm.value as AlteraEmail;
    this.alteraEmailForm.reset();
    this.usuario.alterarMeuEmail(alteraEmail)
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
