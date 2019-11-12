import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ConteudoService } from '../../core/services/conteudo.service';

@Component({
  selector: 'app-not-authorized',
  templateUrl: './not-authorized.component.html'
})
export class NotAuthorizedComponent implements OnInit {

  constructor(
    private conteudo: ConteudoService,
    public title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle(this.conteudo.titulo('Não autorizado'));
  }

}
