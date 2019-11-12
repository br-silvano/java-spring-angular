import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../../core/guards/auth.guard';
import { TurnosLeaveGuard } from './turnos-leave.guard';

import { TurnoCadastroComponent } from './turno-cadastro/turno-cadastro.component';
import { TurnosPesquisaComponent } from './turnos-pesquisa/turnos-pesquisa.component';

const routes: Routes = [
  {
    path: '',
    component: TurnosPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_PESQUISAR_TURNO'] }
  },
  {
    path: 'novo',
    component: TurnoCadastroComponent,
    canActivate: [AuthGuard],
    canDeactivate: [TurnosLeaveGuard],
    data: { roles: ['ROLE_CADASTRAR_TURNO'] }
  },
  {
    path: ':id',
    component: TurnoCadastroComponent,
    canActivate: [AuthGuard],
    canDeactivate: [TurnosLeaveGuard],
    data: { roles: ['ROLE_CADASTRAR_TURNO'] }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TurnosRoutingModule { }
