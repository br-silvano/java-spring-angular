import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import { ConfirmationService } from 'primeng/components/common/api';

import { CursoCadastroComponent } from './curso-cadastro/curso-cadastro.component';

import { CanDeactivateGuard } from '../../core/guards/can-deactivate.guard';

@Injectable()
export class CursosLeaveGuard implements CanDeactivateGuard<CursoCadastroComponent> {

  constructor(
    private confirmation: ConfirmationService
  ) {}

  canDeactivate(component: CursoCadastroComponent) {
    if (!component.dadosAlterados) {
        return true;
    }

    return Observable.create((observer: Observer<boolean>) => {
        this.confirmation.confirm({
            message: 'Você tem alterações não salvas. Tem certeza que deseja sair desta página?',
            accept: () => {
                observer.next(true);
                observer.complete();
            },
            reject: () => {
                observer.next(false);
                observer.complete();
            }
        });
    });
  }

}
