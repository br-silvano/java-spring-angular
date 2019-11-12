import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../../core/guards/auth.guard';
import { UsuariosLeaveGuard } from './usuarios-leave.guard';

import { UsuarioCadastroComponent } from './usuario-cadastro/usuario-cadastro.component';
import { UsuariosPesquisaComponent } from './usuarios-pesquisa/usuarios-pesquisa.component';

const routes: Routes = [
  {
    path: '',
    component: UsuariosPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_PESQUISAR_USUARIO'] }
  },
  {
    path: 'novo',
    component: UsuarioCadastroComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UsuariosLeaveGuard],
    data: { roles: ['ROLE_CADASTRAR_USUARIO'] }
  },
  {
    path: ':id',
    component: UsuarioCadastroComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UsuariosLeaveGuard],
    data: { roles: ['ROLE_CADASTRAR_USUARIO'] }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
