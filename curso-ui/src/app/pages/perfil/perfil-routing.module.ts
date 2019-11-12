import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../core/guards/auth.guard';

import { PerfilComponent } from './perfil.component';
import { PerfilAlteraSenhaComponent } from './perfil-altera-senha/perfil-altera-senha.component';
import { PerfilAlteraEmailComponent } from './perfil-altera-email/perfil-altera-email.component';

const routes: Routes = [
  {
    path: '', component: PerfilComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'alterar-senha',
        pathMatch: 'full'
      },
      {
        path: 'alterar-senha',
        component: PerfilAlteraSenhaComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'alterar-email',
        component: PerfilAlteraEmailComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilRoutingModule { }
