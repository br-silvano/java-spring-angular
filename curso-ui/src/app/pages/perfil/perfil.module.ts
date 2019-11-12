import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxLoadingModule } from 'ngx-loading';

import { SharedModule } from './../../shared/shared.module';
import { PerfilRoutingModule } from './perfil-routing.module';
import { PerfilComponent } from './perfil.component';
import { PerfilAlteraSenhaComponent } from './perfil-altera-senha/perfil-altera-senha.component';
import { PerfilAlteraEmailComponent } from './perfil-altera-email/perfil-altera-email.component';

@NgModule({
  declarations: [PerfilComponent, PerfilAlteraSenhaComponent, PerfilAlteraEmailComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({}),
    SharedModule,
    PerfilRoutingModule
  ]
})
export class PerfilModule { }
