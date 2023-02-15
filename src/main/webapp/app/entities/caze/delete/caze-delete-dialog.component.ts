import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICaze } from '../caze.model';
import { CazeService } from '../service/caze.service';

@Component({
  templateUrl: './caze-delete-dialog.component.html',
})
export class CazeDeleteDialogComponent {
  caze?: ICaze;

  constructor(protected cazeService: CazeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.cazeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
