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
import { FieldsetModule } from 'primeng/components/fieldset/fieldset';
import { PanelModule } from 'primeng/components/panel/panel';
import { TabViewModule } from 'primeng/components/tabview/tabview';

import { SharedModule } from './../../shared/shared.module';
import { AlunosPesquisaComponent } from './alunos-pesquisa/alunos-pesquisa.component';
import { AlunoCadastroComponent } from './aluno-cadastro/aluno-cadastro.component';
import { AlunosRoutingModule } from './alunos-routing.module';

import { AlunosLeaveGuard } from './alunos-leave.guard';

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
    FieldsetModule,
    PanelModule,
    TabViewModule,

    SharedModule,
    AlunosRoutingModule
  ],
  declarations: [
    AlunoCadastroComponent,
    AlunosPesquisaComponent
  ],
  exports: [],
  providers: [AlunosLeaveGuard]
})
export class AlunosModule { }
