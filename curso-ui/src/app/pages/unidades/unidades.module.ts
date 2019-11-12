import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxLoadingModule } from 'ngx-loading';

import { TableModule } from 'primeng/components/table/table';
import { ButtonModule } from 'primeng/components/button/button';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { SelectButtonModule } from 'primeng/components/selectbutton/selectbutton';
import { InputMaskModule } from 'primeng/components/inputmask/inputmask';

import { SharedModule } from './../../shared/shared.module';
import { UnidadesPesquisaComponent } from './unidades-pesquisa/unidades-pesquisa.component';
import { UnidadeCadastroComponent } from './unidade-cadastro/unidade-cadastro.component';
import { UnidadesRoutingModule } from './unidades-routing.module';

import { UnidadesLeaveGuard } from './unidades-leave.guard';

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
    SelectButtonModule,
    InputMaskModule,

    SharedModule,
    UnidadesRoutingModule
  ],
  declarations: [
    UnidadeCadastroComponent,
    UnidadesPesquisaComponent
  ],
  exports: [],
  providers: [UnidadesLeaveGuard]
})
export class UnidadesModule { }
