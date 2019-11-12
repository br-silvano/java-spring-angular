import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TextMaskModule } from 'angular2-text-mask';

import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { PanelModule } from 'primeng/components/panel/panel';
import { MessageModule } from 'primeng/components/message/message';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MessageComponent } from './message/message.component';
import { InputComponent } from './input/input.component';
import { PhoneComponent } from './phone/phone.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    InputTextModule,
    PanelModule,
    MessageModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    MessageComponent,
    InputComponent,
    PhoneComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    MessageComponent,
    InputComponent,
    PhoneComponent
  ]
})
export class SharedModule { }
