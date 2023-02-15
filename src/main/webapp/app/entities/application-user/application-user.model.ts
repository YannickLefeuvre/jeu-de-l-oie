import { IUser } from 'app/entities/user/user.model';
import { IJoueur } from 'app/entities/joueur/joueur.model';

export interface IApplicationUser {
  id?: number;
  nom?: string | null;
  internalUser?: IUser | null;
  joueurs?: IJoueur[] | null;
}

export class ApplicationUser implements IApplicationUser {
  constructor(public id?: number, public nom?: string | null, public internalUser?: IUser | null, public joueurs?: IJoueur[] | null) {}
}

export function getApplicationUserIdentifier(applicationUser: IApplicationUser): number | undefined {
  return applicationUser.id;
}
