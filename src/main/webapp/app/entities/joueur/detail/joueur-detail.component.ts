import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IJoueur } from '../joueur.model';

@Component({
  selector: 'jhi-joueur-detail',
  templateUrl: './joueur-detail.component.html',
})
export class JoueurDetailComponent implements OnInit {
  joueur: IJoueur | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ joueur }) => {
      this.joueur = joueur;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
