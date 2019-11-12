import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { ConteudoService } from '../../core/services/conteudo.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { AuthService } from '../../core/services/auth.service';

import { Login } from '../../core/types/model';
import { EmailPattern } from '../../core/validators/email';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  public loading = false;

  loginForm: FormGroup;

  constructor(
    private conteudo: ConteudoService,
    private auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    public title: Title,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.title.setTitle(this.conteudo.titulo('Login'));

    this.loginForm = this.formBuilder.group({
      usuario: ['', [Validators.required, Validators.pattern(EmailPattern())]],
      senha: ['', [Validators.required]]
    });
  }

  login() {
    this.loading = true;
    const login = this.loginForm.value as Login;
    this.loginForm.reset();
    this.auth.login(login)
      .subscribe(() => {
        this.loading = false;
        this.router.navigate(['/alunos']);
      }, erro => {
        this.loading = false;
        this.errorHandler.handle(erro);
      });
  }

}
