import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ReponseComponent } from './list/reponse.component';
import { ReponseDetailComponent } from './detail/reponse-detail.component';
import { ReponseUpdateComponent } from './update/reponse-update.component';
import { ReponseDeleteDialogComponent } from './delete/reponse-delete-dialog.component';
import { ReponseRoutingModule } from './route/reponse-routing.module';

@NgModule({
  imports: [SharedModule, ReponseRoutingModule],
  declarations: [ReponseComponent, ReponseDetailComponent, ReponseUpdateComponent, ReponseDeleteDialogComponent],
  entryComponents: [ReponseDeleteDialogComponent],
})
export class ReponseModule {}
