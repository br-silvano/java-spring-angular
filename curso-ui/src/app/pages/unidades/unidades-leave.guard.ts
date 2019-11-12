import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import { ConfirmationService } from 'primeng/components/common/api';

import { UnidadeCadastroComponent } from './unidade-cadastro/unidade-cadastro.component';

import { CanDeactivateGuard } from '../../core/guards/can-deactivate.guard';

@Injectable()
export class UnidadesLeaveGuard implements CanDeactivateGuard<UnidadeCadastroComponent> {

  constructor(
    private confirmation: ConfirmationService
  ) {}

  canDeactivate(component: UnidadeCadastroComponent) {
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
