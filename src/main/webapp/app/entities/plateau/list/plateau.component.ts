import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPlateau } from '../plateau.model';
import { PlateauService } from '../service/plateau.service';
import { PlateauDeleteDialogComponent } from '../delete/plateau-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-plateau',
  templateUrl: './plateau.component.html',
})
export class PlateauComponent implements OnInit {
  plateaus?: IPlateau[];
  isLoading = false;

  constructor(protected plateauService: PlateauService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.plateauService.query().subscribe({
      next: (res: HttpResponse<IPlateau[]>) => {
        this.isLoading = false;
        this.plateaus = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IPlateau): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(plateau: IPlateau): void {
    const modalRef = this.modalService.open(PlateauDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.plateau = plateau;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
