import { Injectable } from '@angular/core';

import { ToastaService, ToastOptions, ToastData } from 'ngx-toasta';

@Injectable()
export class ToastyService {

  showClose: boolean;
  timeout: number;
  theme: string;

  constructor(
    private toasty: ToastaService
  ) {
    this.showClose = true;
    this.timeout = 5000;
    this.theme = 'bootstrap';
  }

  Info(msg: string) {
    const toastOptions: ToastOptions = {
        title: 'Informação',
        msg,
        showClose: this.showClose,
        timeout: this.timeout,
        theme: this.theme,
        onAdd: (toast: ToastData) => {
        },
        onRemove: function(toast: ToastData) {
        }
    };

    this.toasty.info(toastOptions);
  }

  Success(msg: string) {
    const toastOptions: ToastOptions = {
        title: 'Sucesso',
        msg,
        showClose: this.showClose,
        timeout: this.timeout,
        theme: this.theme,
        onAdd: (toast: ToastData) => {
        },
        onRemove: function(toast: ToastData) {
        }
    };

    this.toasty.success(toastOptions);
  }

  Wait(msg: string) {
    const toastOptions: ToastOptions = {
        title: 'Aguarde',
        msg,
        showClose: this.showClose,
        timeout: this.timeout,
        theme: this.theme,
        onAdd: (toast: ToastData) => {
        },
        onRemove: function(toast: ToastData) {
        }
    };

    this.toasty.wait(toastOptions);
  }

  Error(msg: string) {
    const toastOptions: ToastOptions = {
        title: 'Erro',
        msg,
        showClose: this.showClose,
        timeout: this.timeout,
        theme: this.theme,
        onAdd: (toast: ToastData) => {
        },
        onRemove: function(toast: ToastData) {
        }
    };

    this.toasty.error(toastOptions);
  }

  Warning(msg: string) {
    const toastOptions: ToastOptions = {
        title: 'Aviso',
        msg,
        showClose: this.showClose,
        timeout: this.timeout,
        theme: this.theme,
        onAdd: (toast: ToastData) => {
        },
        onRemove: function(toast: ToastData) {
        }
    };

    this.toasty.warning(toastOptions);
  }

}
