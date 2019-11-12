import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxLoadingModule } from 'ngx-loading';

import { InputMaskModule } from 'primeng/components/inputmask/inputmask';
import { TableModule } from 'primeng/components/table/table';
import { ButtonModule } from 'primeng/components/button/button';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { PasswordModule } from 'primeng/components/password/password';
import { SelectButtonModule } from 'primeng/components/selectbutton/selectbutton';
import { DialogModule } from 'primeng/components/dialog/dialog';

import { SharedModule } from './../../shared/shared.module';
import { UsuariosPesquisaComponent } from './usuarios-pesquisa/usuarios-pesquisa.component';
import { UsuarioCadastroComponent } from './usuario-cadastro/usuario-cadastro.component';
import { UsuariosRoutingModule } from './usuarios-routing.module';

import { UsuariosLeaveGuard } from './usuarios-leave.guard';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({}),

    InputTextModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    InputMaskModule,
    PasswordModule,
    SelectButtonModule,
    DialogModule,

    SharedModule,
    UsuariosRoutingModule
  ],
  declarations: [
    UsuarioCadastroComponent,
    UsuariosPesquisaComponent
  ],
  exports: [],
  providers: [UsuariosLeaveGuard]
})
export class UsuariosModule { }
