import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgxLoadingModule } from 'ngx-loading';

import { ButtonModule } from 'primeng/components/button/button';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';

import { SharedModule } from './../../shared/shared.module';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({}),

    InputTextModule,
    ButtonModule,

    SharedModule,
    LoginRoutingModule
  ],
  declarations: [LoginComponent],
  providers: []
})
export class LoginModule { }
