import { Component, ElementRef, OnInit } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { DataUtils } from 'app/core/util/data-util.service';
import { PlateauService } from '../service/plateau.service';
import { ActivatedRoute } from '@angular/router';
import { Plateau } from '../plateau.model';
import { IJoueur, Joueur } from 'app/entities/joueur/joueur.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { JoueurService } from 'app/entities/joueur/service/joueur.service';
import { HttpResponse } from '@angular/common/http';
import { Caze } from 'app/entities/caze/caze.model';

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

  private readonly destroy$ = new Subject<void>();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected plateauService: PlateauService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected plateauservice: PlateauService,
    protected joueurService: JoueurService
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
}