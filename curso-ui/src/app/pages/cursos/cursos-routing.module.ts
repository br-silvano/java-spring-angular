import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../../core/guards/auth.guard';
import { CursosLeaveGuard } from './cursos-leave.guard';

import { CursoCadastroComponent } from './curso-cadastro/curso-cadastro.component';
import { CursosPesquisaComponent } from './cursos-pesquisa/cursos-pesquisa.component';

const routes: Routes = [
  {
    path: '',
    component: CursosPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_PESQUISAR_CURSO'] }
  },
  {
    path: 'novo',
    component: CursoCadastroComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CursosLeaveGuard],
    data: { roles: ['ROLE_CADASTRAR_CURSO'] }
  },
  {
    path: ':id',
    component: CursoCadastroComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CursosLeaveGuard],
    data: { roles: ['ROLE_CADASTRAR_CURSO'] }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CursosRoutingModule { }
