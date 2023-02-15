import { ICaze } from 'app/entities/caze/caze.model';
import { IJoueur } from 'app/entities/joueur/joueur.model';

export interface IPlateau {
  id?: number;
  nom?: string | null;
  imageContentType?: string | null;
  image?: string | null;
  nbQuestions?: number | null;
  principal?: boolean | null;
  questions?: ICaze[] | null;
  users?: IJoueur[] | null;
}

export class Plateau implements IPlateau {
  constructor(
    public id?: number,
    public nom?: string | null,
    public imageContentType?: string | null,
    public image?: string | null,
    public nbQuestions?: number | null,
    public principal?: boolean | null,
    public questions?: ICaze[] | null,
    public users?: IJoueur[] | null
  ) {
    this.principal = this.principal ?? false;
  }
}

export function getPlateauIdentifier(plateau: IPlateau): number | undefined {
  return plateau.id;
}
