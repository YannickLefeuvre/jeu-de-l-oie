import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { DataUtils } from 'app/core/util/data-util.service';
import { PlateauService } from '../service/plateau.service';
import { ActivatedRoute } from '@angular/router';
import { Plateau } from '../plateau.model';
import { IJoueur, Joueur } from 'app/entities/joueur/joueur.model';
import { takeUntil } from 'rxjs/operators';
import { finalize, map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { JoueurService } from 'app/entities/joueur/service/joueur.service';
import { HttpResponse } from '@angular/common/http';
import { Caze } from 'app/entities/caze/caze.model';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'ngb-modal';
import { FormBuilder } from '@angular/forms';
import { IReponse, Reponse } from 'app/entities/reponse/reponse.model';
import { ReponseService } from 'app/entities/reponse/service/reponse.service';

@Component({
  selector: 'jhi-jeu',
  templateUrl: './jeu.component.html',
  styleUrls: ['./jeu.component.scss'],
})
export class JeuComponent implements OnInit {
  plateau: Plateau | null = null;
  joueur: Joueur | null = null;
  isLoading = false;
  joueurs?: IJoueur[];
  closeResult = '';
  reponse: Reponse | null = null;
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    question: [],
    reponse: [],
    user: [],
  });

  private readonly destroy$ = new Subject<void>();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected plateauService: PlateauService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected plateauservice: PlateauService,
    protected joueurService: JoueurService,
    private modalService: NgbModal,
    protected fb: FormBuilder,
    protected reponseService: ReponseService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ joueur }) => {
      this.joueur = joueur;
    });

    this.isLoading = true;

    this.joueurService.query().subscribe({
      next: (res: HttpResponse<IJoueur[]>) => {
        this.isLoading = false;
        this.joueurs = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });

    this.getPlateauPrincipal();
  }

  estSurCase(caze: Caze, joueur: Joueur): boolean {
    if (joueur.caze?.id === caze.id) {
      return true;
    }

    return false;
  }

  isPrincipalJoueur(joueur: Joueur): boolean {
    if (this.joueur?.id === joueur.id) {
      return true;
    }
    return false;
  }

  getPlateauPrincipal(): void {
    this.plateauservice
      .findPrincipal()
      .pipe(takeUntil(this.destroy$))
      .subscribe(plateau => (this.plateau = plateau.body));
  }

  open(content: TemplateRef<any>): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result: string) => {
      this.closeResult = `Closed with: ${result}`;
    });
  }

  getcazesuivante(caze: Caze): any {
    if (this.plateau?.questions == null) {
      return null;
    }
    for (const cazze of this.plateau.questions) {
      if (cazze.position === (caze.position ?? -999) + 1) {
        return cazze;
      }
    }
  }

  updateUser(): number {
    let nouvelleCase = null;
    if (this.joueur == null || this.joueur.caze == null || this.joueur.caze.position == null) {
      return 1;
    }
    if (this.joueur.caze.position === this.plateau?.questions?.length) {
      alert('bravo ta fini');
      return 3;
    }
    nouvelleCase = this.getcazesuivante(this.joueur.caze);
    this.joueur.caze = nouvelleCase;
    this.subscribeToSaveResponseJoueur(this.joueurService.update(this.joueur));
    return 2;
  }

  createResponse(): void {
    this.reponse = this.createFromForm();
    this.subscribeToSaveResponseReponse(this.reponseService.create(this.reponse));
    this.updateUser();
  }

  saveReponse(joueur: Joueur | null, modal: ModalComponent): void {
    modal.close();
    this.createResponse();
  }

  previousState(): void {
    window.location.reload();
  }

  protected subscribeToSaveResponseReponse(result: Observable<HttpResponse<IReponse>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      error: () => this.onSaveError(),
    });
  }

  protected subscribeToSaveResponseJoueur(result: Observable<HttpResponse<IJoueur>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected createFromForm(): IReponse {
    return {
      ...new Reponse(),
      id: this.editForm.get(['id'])!.value,
      question: this.joueur?.caze?.question,
      reponse: this.editForm.get(['reponse'])!.value,
      user: this.joueur,
    };
  }
}
