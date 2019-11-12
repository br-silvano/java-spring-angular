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
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { SharedModule } from './../../shared/shared.module';
import { CursosPesquisaComponent } from './cursos-pesquisa/cursos-pesquisa.component';
import { CursoCadastroComponent } from './curso-cadastro/curso-cadastro.component';
import { CursosRoutingModule } from './cursos-routing.module';

import { CursosLeaveGuard } from './cursos-leave.guard';

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
    CurrencyMaskModule,

    SharedModule,
    CursosRoutingModule
  ],
  declarations: [
    CursoCadastroComponent,
    CursosPesquisaComponent
  ],
  exports: [],
  providers: [CursosLeaveGuard]
})
export class CursosModule { }
