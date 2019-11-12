import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import { ConfirmationService } from 'primeng/components/common/api';

import { TurmaCadastroComponent } from './turma-cadastro/turma-cadastro.component';

import { CanDeactivateGuard } from '../../core/guards/can-deactivate.guard';

@Injectable()
export class TurmasLeaveGuard implements CanDeactivateGuard<TurmaCadastroComponent> {

  constructor(
    private confirmation: ConfirmationService
  ) {}

  canDeactivate(component: TurmaCadastroComponent) {
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
