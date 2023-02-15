import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ReponseComponent } from '../list/reponse.component';
import { ReponseDetailComponent } from '../detail/reponse-detail.component';
import { ReponseUpdateComponent } from '../update/reponse-update.component';
import { ReponseRoutingResolveService } from './reponse-routing-resolve.service';

const reponseRoute: Routes = [
  {
    path: '',
    component: ReponseComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReponseDetailComponent,
    resolve: {
      reponse: ReponseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReponseUpdateComponent,
    resolve: {
      reponse: ReponseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReponseUpdateComponent,
    resolve: {
      reponse: ReponseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(reponseRoute)],
  exports: [RouterModule],
})
export class ReponseRoutingModule {}
