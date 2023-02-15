import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IJoueur } from '../joueur.model';
import { JoueurService } from '../service/joueur.service';
import { JoueurDeleteDialogComponent } from '../delete/joueur-delete-dialog.component';

@Component({
  selector: 'jhi-joueur',
  templateUrl: './joueur.component.html',
})
export class JoueurComponent implements OnInit {
  joueurs?: IJoueur[];
  isLoading = false;

  constructor(protected joueurService: JoueurService, protected modalService: NgbModal) {}

  loadAll(): void {
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
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IJoueur): number {
    return item.id!;
  }

  delete(joueur: IJoueur): void {
    const modalRef = this.modalService.open(JoueurDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.joueur = joueur;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
