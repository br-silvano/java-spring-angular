import { Title } from '@angular/platform-browser';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePT from '@angular/common/locales/pt';

registerLocaleData(localePT);

import { ConfirmationService } from 'primeng/components/common/api';
import { ConfirmDialogModule } from 'primeng/components/confirmdialog/confirmdialog';
import { ToastaModule } from 'ngx-toasta';

import { JwtModule } from '@auth0/angular-jwt';

import { AuthGuard } from './guards/auth.guard';
import { AuthHttp, AuthHttpCreator } from './auth-http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { AuthService } from './services/auth.service';
import { LogoutService } from './services/logout.service';
import { ToastyService } from './services/toasty.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { CalendarService } from './services/calendar.service';
import { ConteudoService } from './services/conteudo.service';
import { UsuarioService } from './services/usuario.service';
import { PermissaoService } from './services/permissao.service';
import { UnidadeService } from './services/unidade.service';
import { CursoService } from './services/curso.service';
import { TurnoService } from './services/turno.service';
import { AlunoService } from './services/aluno.service';
import { StatusTurmaService } from './services/status-turma.service';
import { TurmaService } from './services/turma.service';
import { StatusMatriculaService } from './services/status-matricula.service';
import { MatriculaService } from './services/matricula.service';
import { CepService } from './services/cep.service';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ToastaModule.forRoot(),
    ConfirmDialogModule,
    JwtModule.forRoot({
      config: { tokenGetter }
    }),
  ],
  declarations: [],
  exports: [
    ToastaModule,
    ConfirmDialogModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    LogoutService,
    ConteudoService,
    ToastyService,
    AuthService,
    ErrorHandlerService,
    CalendarService,
    UsuarioService,
    PermissaoService,
    UnidadeService,
    CursoService,
    TurnoService,
    AlunoService,
    StatusTurmaService,
    TurmaService,
    StatusMatriculaService,
    MatriculaService,
    ConfirmationService,
    CepService,
    Title,
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: AuthHttp, useFactory: AuthHttpCreator, deps: [AuthService, HttpClient] },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class CoreModule { }
