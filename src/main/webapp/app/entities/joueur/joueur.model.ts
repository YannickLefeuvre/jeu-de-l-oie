import { IReponse } from 'app/entities/reponse/reponse.model';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ICaze } from 'app/entities/caze/caze.model';
import { IPlateau } from 'app/entities/plateau/plateau.model';
import { Couleur } from 'app/entities/enumerations/couleur.model';

export interface IJoueur {
  id?: number;
  nom?: string | null;
  positions?: number | null;
  couleur?: Couleur | null;
  reponses?: IReponse[] | null;
  user?: IApplicationUser | null;
  caze?: ICaze | null;
  plateau?: IPlateau | null;
}

export class Joueur implements IJoueur {
  constructor(
    public id?: number,
    public nom?: string | null,
    public positions?: number | null,
    public couleur?: Couleur | null,
    public reponses?: IReponse[] | null,
    public user?: IApplicationUser | null,
    public caze?: ICaze | null,
    public plateau?: IPlateau | null
  ) {}
}

export function getJoueurIdentifier(joueur: IJoueur): number | undefined {
  return joueur.id;
}
