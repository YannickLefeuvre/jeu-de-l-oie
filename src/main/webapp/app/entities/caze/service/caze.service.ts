import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICaze, getCazeIdentifier } from '../caze.model';

export type EntityResponseType = HttpResponse<ICaze>;
export type EntityArrayResponseType = HttpResponse<ICaze[]>;

@Injectable({ providedIn: 'root' })
export class CazeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cazes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(caze: ICaze): Observable<EntityResponseType> {
    return this.http.post<ICaze>(this.resourceUrl, caze, { observe: 'response' });
  }

  update(caze: ICaze): Observable<EntityResponseType> {
    return this.http.put<ICaze>(`${this.resourceUrl}/${getCazeIdentifier(caze) as number}`, caze, { observe: 'response' });
  }

  partialUpdate(caze: ICaze): Observable<EntityResponseType> {
    return this.http.patch<ICaze>(`${this.resourceUrl}/${getCazeIdentifier(caze) as number}`, caze, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICaze>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICaze[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCazeToCollectionIfMissing(cazeCollection: ICaze[], ...cazesToCheck: (ICaze | null | undefined)[]): ICaze[] {
    const cazes: ICaze[] = cazesToCheck.filter(isPresent);
    if (cazes.length > 0) {
      const cazeCollectionIdentifiers = cazeCollection.map(cazeItem => getCazeIdentifier(cazeItem)!);
      const cazesToAdd = cazes.filter(cazeItem => {
        const cazeIdentifier = getCazeIdentifier(cazeItem);
        if (cazeIdentifier == null || cazeCollectionIdentifiers.includes(cazeIdentifier)) {
          return false;
        }
        cazeCollectionIdentifiers.push(cazeIdentifier);
        return true;
      });
      return [...cazesToAdd, ...cazeCollection];
    }
    return cazeCollection;
  }
}
