import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../../core/guards/auth.guard';
import { UnidadesLeaveGuard } from './unidades-leave.guard';

import { UnidadeCadastroComponent } from './unidade-cadastro/unidade-cadastro.component';
import { UnidadesPesquisaComponent } from './unidades-pesquisa/unidades-pesquisa.component';

const routes: Routes = [
  {
    path: '',
    component: UnidadesPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_PESQUISAR_UNIDADE'] }
  },
  {
    path: 'nova',
    component: UnidadeCadastroComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnidadesLeaveGuard],
    data: { roles: ['ROLE_CADASTRAR_UNIDADE'] }
  },
  {
    path: ':id',
    component: UnidadeCadastroComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnidadesLeaveGuard],
    data: { roles: ['ROLE_CADASTRAR_UNIDADE'] }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UnidadesRoutingModule { }
