import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../../core/guards/auth.guard';
import { TurmasLeaveGuard } from './turmas-leave.guard';

import { TurmaCadastroComponent } from './turma-cadastro/turma-cadastro.component';
import { TurmasPesquisaComponent } from './turmas-pesquisa/turmas-pesquisa.component';

const routes: Routes = [
  {
    path: '',
    component: TurmasPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_PESQUISAR_TURMA'] }
  },
  {
    path: 'nova',
    component: TurmaCadastroComponent,
    canActivate: [AuthGuard],
    canDeactivate: [TurmasLeaveGuard],
    data: { roles: ['ROLE_CADASTRAR_TURMA'] }
  },
  {
    path: ':id',
    component: TurmaCadastroComponent,
    canActivate: [AuthGuard],
    canDeactivate: [TurmasLeaveGuard],
    data: { roles: ['ROLE_CADASTRAR_TURMA'] }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TurmasRoutingModule { }
