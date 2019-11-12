import { Component } from '@angular/core';

import { ToastaConfig } from 'ngx-toasta';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(
    private toastaConfig: ToastaConfig
  ) {
    // Possible values: default, bootstrap, material
    this.toastaConfig.theme = 'bootstrap';
  }

  onActivate(event: any) {
    window.scroll(0, 0);
  }
}
