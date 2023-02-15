import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IReponse, Reponse } from '../reponse.model';
import { ReponseService } from '../service/reponse.service';

@Injectable({ providedIn: 'root' })
export class ReponseRoutingResolveService implements Resolve<IReponse> {
  constructor(protected service: ReponseService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IReponse> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((reponse: HttpResponse<Reponse>) => {
          if (reponse.body) {
            return of(reponse.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Reponse());
  }
}
