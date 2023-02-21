import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CazeComponent } from './list/caze.component';
import { CazeDetailComponent } from './detail/caze-detail.component';
import { CazeUpdateComponent } from './update/caze-update.component';
import { CazeDeleteDialogComponent } from './delete/caze-delete-dialog.component';
import { CazeRoutingModule } from './route/caze-routing.module';

@NgModule({
  imports: [SharedModule, CazeRoutingModule],
  declarations: [CazeComponent, CazeDetailComponent, CazeUpdateComponent, CazeDeleteDialogComponent],
})
export class CazeModule {}
