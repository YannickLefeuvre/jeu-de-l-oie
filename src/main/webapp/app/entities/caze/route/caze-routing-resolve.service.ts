import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICaze, Caze } from '../caze.model';
import { CazeService } from '../service/caze.service';

@Injectable({ providedIn: 'root' })
export class CazeRoutingResolveService implements Resolve<ICaze> {
  constructor(protected service: CazeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICaze> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((caze: HttpResponse<Caze>) => {
          if (caze.body) {
            return of(caze.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Caze());
  }
}
