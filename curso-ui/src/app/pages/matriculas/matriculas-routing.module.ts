import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../../core/guards/auth.guard';
import { MatriculasLeaveGuard } from './matriculas-leave.guard';

import { MatriculaCadastroComponent } from './matricula-cadastro/matricula-cadastro.component';
import { MatriculasPesquisaComponent } from './matriculas-pesquisa/matriculas-pesquisa.component';

const routes: Routes = [
  {
    path: '',
    component: MatriculasPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_PESQUISAR_MATRICULA'] }
  },
  {
    path: 'nova',
    component: MatriculaCadastroComponent,
    canActivate: [AuthGuard],
    canDeactivate: [MatriculasLeaveGuard],
    data: { roles: ['ROLE_REALIZAR_MATRICULA'] }
  },
  {
    path: ':id',
    component: MatriculaCadastroComponent,
    canActivate: [AuthGuard],
    canDeactivate: [MatriculasLeaveGuard],
    data: { roles: ['ROLE_REALIZAR_MATRICULA'] }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MatriculasRoutingModule { }
