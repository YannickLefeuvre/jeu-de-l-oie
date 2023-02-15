import { IJoueur } from 'app/entities/joueur/joueur.model';

export interface IReponse {
  id?: number;
  question?: string | null;
  reponse?: string | null;
  user?: IJoueur | null;
}

export class Reponse implements IReponse {
  constructor(public id?: number, public question?: string | null, public reponse?: string | null, public user?: IJoueur | null) {}
}

export function getReponseIdentifier(reponse: IReponse): number | undefined {
  return reponse.id;
}
