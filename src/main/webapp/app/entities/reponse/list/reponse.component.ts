import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IReponse } from '../reponse.model';
import { ReponseService } from '../service/reponse.service';
import { ReponseDeleteDialogComponent } from '../delete/reponse-delete-dialog.component';

@Component({
  selector: 'jhi-reponse',
  templateUrl: './reponse.component.html',
})
export class ReponseComponent implements OnInit {
  reponses?: IReponse[];
  isLoading = false;

  constructor(protected reponseService: ReponseService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.reponseService.query().subscribe({
      next: (res: HttpResponse<IReponse[]>) => {
        this.isLoading = false;
        this.reponses = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IReponse): number {
    return item.id!;
  }

  delete(reponse: IReponse): void {
    const modalRef = this.modalService.open(ReponseDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.reponse = reponse;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
