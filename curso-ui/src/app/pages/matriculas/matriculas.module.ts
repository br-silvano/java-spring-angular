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
import { DropdownModule } from 'primeng/components/dropdown/dropdown';
import { SpinnerModule } from 'primeng/components/spinner/spinner';

import { SharedModule } from './../../shared/shared.module';
import { MatriculasPesquisaComponent } from './matriculas-pesquisa/matriculas-pesquisa.component';
import { MatriculaCadastroComponent } from './matricula-cadastro/matricula-cadastro.component';
import { MatriculasRoutingModule } from './matriculas-routing.module';

import { MatriculasLeaveGuard } from './matriculas-leave.guard';

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
    DropdownModule,
    SpinnerModule,

    SharedModule,
    MatriculasRoutingModule
  ],
  declarations: [
    MatriculaCadastroComponent,
    MatriculasPesquisaComponent
  ],
  exports: [],
  providers: [MatriculasLeaveGuard]
})
export class MatriculasModule { }
