import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanDeactivateGuard<T> {
  canDeactivate(component: T, route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
      Observable<boolean> | Promise<boolean> | boolean;
}
