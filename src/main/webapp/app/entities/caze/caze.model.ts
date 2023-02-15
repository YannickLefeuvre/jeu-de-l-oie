import { IJoueur } from 'app/entities/joueur/joueur.model';
import { IPlateau } from 'app/entities/plateau/plateau.model';

export interface ICaze {
  id?: number;
  question?: string | null;
  absice?: number | null;
  ordo?: number | null;
  position?: number | null;
  users?: IJoueur[] | null;
  plateau?: IPlateau | null;
}

export class Caze implements ICaze {
  constructor(
    public id?: number,
    public question?: string | null,
    public absice?: number | null,
    public ordo?: number | null,
    public position?: number | null,
    public users?: IJoueur[] | null,
    public plateau?: IPlateau | null
  ) {}
}

export function getCazeIdentifier(caze: ICaze): number | undefined {
  return caze.id;
}
