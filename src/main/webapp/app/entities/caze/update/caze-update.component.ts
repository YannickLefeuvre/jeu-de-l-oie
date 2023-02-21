import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICaze, Caze } from '../caze.model';
import { CazeService } from '../service/caze.service';
import { IPlateau } from 'app/entities/plateau/plateau.model';
import { PlateauService } from 'app/entities/plateau/service/plateau.service';

@Component({
  selector: 'jhi-caze-update',
  templateUrl: './caze-update.component.html',
})
export class CazeUpdateComponent implements OnInit {
  isSaving = false;

  plateausSharedCollection: IPlateau[] = [];

  editForm = this.fb.group({
    id: [],
    question: [],
    absice: [],
    ordo: [],
    position: [],
    plateau: [],
  });

  constructor(
    protected cazeService: CazeService,
    protected plateauService: PlateauService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ caze }) => {
      this.updateForm(caze);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const caze = this.createFromForm();
    if (caze.id !== undefined) {
      this.subscribeToSaveResponse(this.cazeService.update(caze));
    } else {
      this.subscribeToSaveResponse(this.cazeService.create(caze));
    }
  }

  trackPlateauById(_index: number, item: IPlateau): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICaze>>): void {
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

  protected updateForm(caze: ICaze): void {
    this.editForm.patchValue({
      id: caze.id,
      question: caze.question,
      absice: caze.absice,
      ordo: caze.ordo,
      position: caze.position,
      plateau: caze.plateau,
    });

    this.plateausSharedCollection = this.plateauService.addPlateauToCollectionIfMissing(this.plateausSharedCollection, caze.plateau);
  }

  protected loadRelationshipsOptions(): void {
    this.plateauService
      .query()
      .pipe(map((res: HttpResponse<IPlateau[]>) => res.body ?? []))
      .pipe(
        map((plateaus: IPlateau[]) => this.plateauService.addPlateauToCollectionIfMissing(plateaus, this.editForm.get('plateau')!.value))
      )
      .subscribe((plateaus: IPlateau[]) => (this.plateausSharedCollection = plateaus));
  }

  protected createFromForm(): ICaze {
    return {
      ...new Caze(),
      id: this.editForm.get(['id'])!.value,
      question: this.editForm.get(['question'])!.value,
      absice: this.editForm.get(['absice'])!.value,
      ordo: this.editForm.get(['ordo'])!.value,
      position: this.editForm.get(['position'])!.value,
      plateau: this.editForm.get(['plateau'])!.value,
    };
  }
}
