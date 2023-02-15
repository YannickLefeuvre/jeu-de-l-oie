import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPlateau, getPlateauIdentifier } from '../plateau.model';

export type EntityResponseType = HttpResponse<IPlateau>;
export type EntityArrayResponseType = HttpResponse<IPlateau[]>;

@Injectable({ providedIn: 'root' })
export class PlateauService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/plateaus');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(plateau: IPlateau): Observable<EntityResponseType> {
    return this.http.post<IPlateau>(this.resourceUrl, plateau, { observe: 'response' });
  }

  update(plateau: IPlateau): Observable<EntityResponseType> {
    return this.http.put<IPlateau>(`${this.resourceUrl}/${getPlateauIdentifier(plateau) as number}`, plateau, { observe: 'response' });
  }

  partialUpdate(plateau: IPlateau): Observable<EntityResponseType> {
    return this.http.patch<IPlateau>(`${this.resourceUrl}/${getPlateauIdentifier(plateau) as number}`, plateau, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPlateau>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPlateau[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPlateauToCollectionIfMissing(plateauCollection: IPlateau[], ...plateausToCheck: (IPlateau | null | undefined)[]): IPlateau[] {
    const plateaus: IPlateau[] = plateausToCheck.filter(isPresent);
    if (plateaus.length > 0) {
      const plateauCollectionIdentifiers = plateauCollection.map(plateauItem => getPlateauIdentifier(plateauItem)!);
      const plateausToAdd = plateaus.filter(plateauItem => {
        const plateauIdentifier = getPlateauIdentifier(plateauItem);
        if (plateauIdentifier == null || plateauCollectionIdentifiers.includes(plateauIdentifier)) {
          return false;
        }
        plateauCollectionIdentifiers.push(plateauIdentifier);
        return true;
      });
      return [...plateausToAdd, ...plateauCollection];
    }
    return plateauCollection;
  }
}
