import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICaze } from '../caze.model';
import { CazeService } from '../service/caze.service';
import { CazeDeleteDialogComponent } from '../delete/caze-delete-dialog.component';

@Component({
  selector: 'jhi-caze',
  templateUrl: './caze.component.html',
})
export class CazeComponent implements OnInit {
  cazes?: ICaze[];
  isLoading = false;

  constructor(protected cazeService: CazeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.cazeService.query().subscribe({
      next: (res: HttpResponse<ICaze[]>) => {
        this.isLoading = false;
        this.cazes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ICaze): number {
    return item.id!;
  }

  delete(caze: ICaze): void {
    const modalRef = this.modalService.open(CazeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.caze = caze;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
