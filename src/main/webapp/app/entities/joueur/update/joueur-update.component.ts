import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IJoueur, Joueur } from '../joueur.model';
import { JoueurService } from '../service/joueur.service';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';
import { ICaze } from 'app/entities/caze/caze.model';
import { CazeService } from 'app/entities/caze/service/caze.service';
import { IPlateau } from 'app/entities/plateau/plateau.model';
import { PlateauService } from 'app/entities/plateau/service/plateau.service';
import { Couleur } from 'app/entities/enumerations/couleur.model';

@Component({
  selector: 'jhi-joueur-update',
  templateUrl: './joueur-update.component.html',
})
export class JoueurUpdateComponent implements OnInit {
  isSaving = false;
  couleurValues = Object.keys(Couleur);

  applicationUsersSharedCollection: IApplicationUser[] = [];
  cazesSharedCollection: ICaze[] = [];
  plateausSharedCollection: IPlateau[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [],
    positions: [],
    couleur: [],
    user: [],
    caze: [],
    plateau: [],
  });

  constructor(
    protected joueurService: JoueurService,
    protected applicationUserService: ApplicationUserService,
    protected cazeService: CazeService,
    protected plateauService: PlateauService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ joueur }) => {
      this.updateForm(joueur);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const joueur = this.createFromForm();
    if (joueur.id !== undefined) {
      this.subscribeToSaveResponse(this.joueurService.update(joueur));
    } else {
      this.subscribeToSaveResponse(this.joueurService.create(joueur));
    }
  }

  trackApplicationUserById(_index: number, item: IApplicationUser): number {
    return item.id!;
  }

  trackCazeById(_index: number, item: ICaze): number {
    return item.id!;
  }

  trackPlateauById(_index: number, item: IPlateau): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJoueur>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(joueur: IJoueur): void {
    this.editForm.patchValue({
      id: joueur.id,
      nom: joueur.nom,
      positions: joueur.positions,
      couleur: joueur.couleur,
      user: joueur.user,
      caze: joueur.caze,
      plateau: joueur.plateau,
    });

    this.applicationUsersSharedCollection = this.applicationUserService.addApplicationUserToCollectionIfMissing(
      this.applicationUsersSharedCollection,
      joueur.user
    );
    this.cazesSharedCollection = this.cazeService.addCazeToCollectionIfMissing(this.cazesSharedCollection, joueur.caze);
    this.plateausSharedCollection = this.plateauService.addPlateauToCollectionIfMissing(this.plateausSharedCollection, joueur.plateau);
  }

  protected loadRelationshipsOptions(): void {
    this.applicationUserService
      .query()
      .pipe(map((res: HttpResponse<IApplicationUser[]>) => res.body ?? []))
      .pipe(
        map((applicationUsers: IApplicationUser[]) =>
          this.applicationUserService.addApplicationUserToCollectionIfMissing(applicationUsers, this.editForm.get('user')!.value)
        )
      )
      .subscribe((applicationUsers: IApplicationUser[]) => (this.applicationUsersSharedCollection = applicationUsers));

    this.cazeService
      .query()
      .pipe(map((res: HttpResponse<ICaze[]>) => res.body ?? []))
      .pipe(map((cazes: ICaze[]) => this.cazeService.addCazeToCollectionIfMissing(cazes, this.editForm.get('caze')!.value)))
      .subscribe((cazes: ICaze[]) => (this.cazesSharedCollection = cazes));

    this.plateauService
      .query()
      .pipe(map((res: HttpResponse<IPlateau[]>) => res.body ?? []))
      .pipe(
        map((plateaus: IPlateau[]) => this.plateauService.addPlateauToCollectionIfMissing(plateaus, this.editForm.get('plateau')!.value))
      )
      .subscribe((plateaus: IPlateau[]) => (this.plateausSharedCollection = plateaus));
  }

  protected createFromForm(): IJoueur {
    return {
      ...new Joueur(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      positions: this.editForm.get(['positions'])!.value,
      couleur: this.editForm.get(['couleur'])!.value,
      user: this.editForm.get(['user'])!.value,
      caze: this.editForm.get(['caze'])!.value,
      plateau: this.editForm.get(['plateau'])!.value,
    };
  }
}
