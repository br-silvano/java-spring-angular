import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BuscaCep } from '../types/model';

@Injectable()
export class CepService {

  cepsUrl: string;

  constructor(private http: HttpClient) {
    this.cepsUrl = '//viacep.com.br/ws';
  }

  buscar(cep: string): Observable<BuscaCep> {
    return this.http.get(`${this.cepsUrl}/${cep}/json/`)
      .pipe(map((response: BuscaCep) => response));
  }

}
