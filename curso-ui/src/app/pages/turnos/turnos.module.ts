import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxLoadingModule } from 'ngx-loading';

import { TableModule } from 'primeng/components/table/table';
import { ButtonModule } from 'primeng/components/button/button';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { SelectButtonModule } from 'primeng/components/selectbutton/selectbutton';

import { SharedModule } from './../../shared/shared.module';
import { TurnosPesquisaComponent } from './turnos-pesquisa/turnos-pesquisa.component';
import { TurnoCadastroComponent } from './turno-cadastro/turno-cadastro.component';
import { TurnosRoutingModule } from './turnos-routing.module';

import { TurnosLeaveGuard } from './turnos-leave.guard';

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

    SharedModule,
    TurnosRoutingModule
  ],
  declarations: [
    TurnoCadastroComponent,
    TurnosPesquisaComponent
  ],
  exports: [],
  providers: [TurnosLeaveGuard]
})
export class TurnosModule { }
