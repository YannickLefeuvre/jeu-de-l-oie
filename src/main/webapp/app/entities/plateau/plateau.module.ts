import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PlateauComponent } from './list/plateau.component';
import { PlateauDetailComponent } from './detail/plateau-detail.component';
import { PlateauUpdateComponent } from './update/plateau-update.component';
import { PlateauDeleteDialogComponent } from './delete/plateau-delete-dialog.component';
import { PlateauRoutingModule } from './route/plateau-routing.module';
import { JeuComponent } from './jeu/jeu.component';

@NgModule({
  imports: [SharedModule, PlateauRoutingModule],
  declarations: [PlateauComponent, PlateauDetailComponent, PlateauUpdateComponent, PlateauDeleteDialogComponent, JeuComponent],
  entryComponents: [PlateauDeleteDialogComponent],
})
export class PlateauModule {}
