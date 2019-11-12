import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import Swal from 'sweetalert2';

import { ToastyService } from './toasty.service';
import { NotAuthenticatedError } from '../auth-http';

@Injectable()
export class ErrorHandlerService {

  constructor(
    private router: Router,
    private toasty: ToastyService
  ) { }

  handle(errorResponse: any, toasty: boolean = false) {
    let msg: string;

    if (typeof errorResponse === 'string') {
      msg = errorResponse;

    } else if (errorResponse instanceof NotAuthenticatedError) {
      msg = 'Sua sessão expirou!';
      this.router.navigate(['/login']);

    } else if (errorResponse instanceof HttpErrorResponse
        && errorResponse.status >= 400 && errorResponse.status <= 499) {
      let errors;
      msg = 'Ocorreu um erro ao processar a sua solicitação';

      if (errorResponse.status === 403) {
        msg = 'Você não tem permissão para executar esta ação';
      }

      try {
        errors = errorResponse;

        msg = errors.error[0].mensagemUsuario;
      } catch (e) { }

      console.error('Ocorreu um erro', errorResponse);

    } else {
      msg = 'Erro ao processar o serviço remoto. Tente novamente.';
      console.error('Ocorreu um erro', errorResponse);
    }

    if (!toasty) {
      Swal.fire({
        title: 'Erro!',
        text: msg,
        type: 'error',
        showCancelButton: false,
        confirmButtonText: 'Ok'
      });
    } else {
      this.toasty.Error(msg);
    }
  }

}
