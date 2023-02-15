import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IReponse, Reponse } from '../reponse.model';
import { ReponseService } from '../service/reponse.service';
import { IJoueur } from 'app/entities/joueur/joueur.model';
import { JoueurService } from 'app/entities/joueur/service/joueur.service';

@Component({
  selector: 'jhi-reponse-update',
  templateUrl: './reponse-update.component.html',
})
export class ReponseUpdateComponent implements OnInit {
  isSaving = false;

  joueursSharedCollection: IJoueur[] = [];

  editForm = this.fb.group({
    id: [],
    question: [],
    reponse: [],
    user: [],
  });

  constructor(
    protected reponseService: ReponseService,
    protected joueurService: JoueurService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reponse }) => {
      this.updateForm(reponse);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reponse = this.createFromForm();
    if (reponse.id !== undefined) {
      this.subscribeToSaveResponse(this.reponseService.update(reponse));
    } else {
      this.subscribeToSaveResponse(this.reponseService.create(reponse));
    }
  }

  trackJoueurById(_index: number, item: IJoueur): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReponse>>): void {
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

  protected updateForm(reponse: IReponse): void {
    this.editForm.patchValue({
      id: reponse.id,
      question: reponse.question,
      reponse: reponse.reponse,
      user: reponse.user,
    });

    this.joueursSharedCollection = this.joueurService.addJoueurToCollectionIfMissing(this.joueursSharedCollection, reponse.user);
  }

  protected loadRelationshipsOptions(): void {
    this.joueurService
      .query()
      .pipe(map((res: HttpResponse<IJoueur[]>) => res.body ?? []))
      .pipe(map((joueurs: IJoueur[]) => this.joueurService.addJoueurToCollectionIfMissing(joueurs, this.editForm.get('user')!.value)))
      .subscribe((joueurs: IJoueur[]) => (this.joueursSharedCollection = joueurs));
  }

  protected createFromForm(): IReponse {
    return {
      ...new Reponse(),
      id: this.editForm.get(['id'])!.value,
      question: this.editForm.get(['question'])!.value,
      reponse: this.editForm.get(['reponse'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
