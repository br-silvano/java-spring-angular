import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../../shared/shared.module';
import { NotAuthorizedRoutingModule } from './not-authorized-routing.module';
import { NotAuthorizedComponent } from './not-authorized.component';

@NgModule({
  declarations: [NotAuthorizedComponent],
  imports: [
    CommonModule,
    SharedModule,
    NotAuthorizedRoutingModule
  ]
})
export class NotAuthorizedModule { }
