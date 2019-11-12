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
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';

import { SharedModule } from './../../shared/shared.module';
import { TurmasPesquisaComponent } from './turmas-pesquisa/turmas-pesquisa.component';
import { TurmaCadastroComponent } from './turma-cadastro/turma-cadastro.component';
import { TurmasRoutingModule } from './turmas-routing.module';

import { TurmasLeaveGuard } from './turmas-leave.guard';

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
    CalendarModule,
    DropdownModule,

    SharedModule,
    TurmasRoutingModule
  ],
  declarations: [
    TurmaCadastroComponent,
    TurmasPesquisaComponent
  ],
  exports: [],
  providers: [TurmasLeaveGuard]
})
export class TurmasModule { }
