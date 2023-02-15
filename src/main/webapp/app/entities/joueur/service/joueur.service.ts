import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJoueur, getJoueurIdentifier } from '../joueur.model';

export type EntityResponseType = HttpResponse<IJoueur>;
export type EntityArrayResponseType = HttpResponse<IJoueur[]>;

@Injectable({ providedIn: 'root' })
export class JoueurService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/joueurs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(joueur: IJoueur): Observable<EntityResponseType> {
    return this.http.post<IJoueur>(this.resourceUrl, joueur, { observe: 'response' });
  }

  update(joueur: IJoueur): Observable<EntityResponseType> {
    return this.http.put<IJoueur>(`${this.resourceUrl}/${getJoueurIdentifier(joueur) as number}`, joueur, { observe: 'response' });
  }

  partialUpdate(joueur: IJoueur): Observable<EntityResponseType> {
    return this.http.patch<IJoueur>(`${this.resourceUrl}/${getJoueurIdentifier(joueur) as number}`, joueur, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IJoueur>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IJoueur[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addJoueurToCollectionIfMissing(joueurCollection: IJoueur[], ...joueursToCheck: (IJoueur | null | undefined)[]): IJoueur[] {
    const joueurs: IJoueur[] = joueursToCheck.filter(isPresent);
    if (joueurs.length > 0) {
      const joueurCollectionIdentifiers = joueurCollection.map(joueurItem => getJoueurIdentifier(joueurItem)!);
      const joueursToAdd = joueurs.filter(joueurItem => {
        const joueurIdentifier = getJoueurIdentifier(joueurItem);
        if (joueurIdentifier == null || joueurCollectionIdentifiers.includes(joueurIdentifier)) {
          return false;
        }
        joueurCollectionIdentifiers.push(joueurIdentifier);
        return true;
      });
      return [...joueursToAdd, ...joueurCollection];
    }
    return joueurCollection;
  }
}
