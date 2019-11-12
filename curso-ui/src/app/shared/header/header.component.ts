import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import Swal from 'sweetalert2';

import { LogoutService } from './../../core/services/logout.service';
import { ErrorHandlerService } from './../../core/services/error-handler.service';
import { AuthService } from './../../core/services/auth.service';
import { ConteudoService } from './../../core/services/conteudo.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  @ViewChild('navBurger') navBurger: ElementRef;
  @ViewChild('navMenu') navMenu: ElementRef;

  exibindoMenu = false;

  constructor(
    private conteudoService: ConteudoService,
    public auth: AuthService,
    private logoutService: LogoutService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logout() {
    Swal.fire({
      title: 'Atenção!',
      text: 'Você deseja realmente sair?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      if (result.value) {
        this.logoutService.logout()
        .then(() => {
          this.router.navigate(['/login']);
        })
        .catch(erro => this.errorHandler.handle(erro));
      }
    });
  }

  get logado() {
    return !this.auth.isAccessTokenInvalido();
  }

  temPermissao(permissao: string) {
    return this.auth.temPermissao(permissao);
  }

  toggleNavbar() {
    this.navBurger.nativeElement.classList.toggle('is-active');
    this.navMenu.nativeElement.classList.toggle('is-active');
  }

  get projeto() {
    return this.conteudoService.projeto;
  }

}
