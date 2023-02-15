import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReponse, getReponseIdentifier } from '../reponse.model';

export type EntityResponseType = HttpResponse<IReponse>;
export type EntityArrayResponseType = HttpResponse<IReponse[]>;

@Injectable({ providedIn: 'root' })
export class ReponseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/reponses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(reponse: IReponse): Observable<EntityResponseType> {
    return this.http.post<IReponse>(this.resourceUrl, reponse, { observe: 'response' });
  }

  update(reponse: IReponse): Observable<EntityResponseType> {
    return this.http.put<IReponse>(`${this.resourceUrl}/${getReponseIdentifier(reponse) as number}`, reponse, { observe: 'response' });
  }

  partialUpdate(reponse: IReponse): Observable<EntityResponseType> {
    return this.http.patch<IReponse>(`${this.resourceUrl}/${getReponseIdentifier(reponse) as number}`, reponse, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IReponse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IReponse[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addReponseToCollectionIfMissing(reponseCollection: IReponse[], ...reponsesToCheck: (IReponse | null | undefined)[]): IReponse[] {
    const reponses: IReponse[] = reponsesToCheck.filter(isPresent);
    if (reponses.length > 0) {
      const reponseCollectionIdentifiers = reponseCollection.map(reponseItem => getReponseIdentifier(reponseItem)!);
      const reponsesToAdd = reponses.filter(reponseItem => {
        const reponseIdentifier = getReponseIdentifier(reponseItem);
        if (reponseIdentifier == null || reponseCollectionIdentifiers.includes(reponseIdentifier)) {
          return false;
        }
        reponseCollectionIdentifiers.push(reponseIdentifier);
        return true;
      });
      return [...reponsesToAdd, ...reponseCollection];
    }
    return reponseCollection;
  }
}
