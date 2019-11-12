import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ConteudoService } from '../../core/services/conteudo.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {

  constructor(
    private conteudo: ConteudoService,
    public title: Title,
  ) { }

  ngOnInit() {
    this.title.setTitle(this.conteudo.titulo('Perfil'));
  }

}
