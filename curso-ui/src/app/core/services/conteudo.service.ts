import { Injectable } from '@angular/core';

@Injectable()
export class ConteudoService {

  static projeto = 'Alice´s Mind';

  constructor(
  ) {}

  titulo(nomePagina: string) {
    return nomePagina + ' | ' + ConteudoService.projeto;
  }

  get projeto() {
    return ConteudoService.projeto;
  }

}
