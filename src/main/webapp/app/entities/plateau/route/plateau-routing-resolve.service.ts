import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPlateau, Plateau } from '../plateau.model';
import { PlateauService } from '../service/plateau.service';

@Injectable({ providedIn: 'root' })
export class PlateauRoutingResolveService implements Resolve<IPlateau> {
  constructor(protected service: PlateauService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPlateau> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((plateau: HttpResponse<Plateau>) => {
          if (plateau.body) {
            return of(plateau.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Plateau());
  }
}
