import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PlateauComponent } from '../list/plateau.component';
import { PlateauDetailComponent } from '../detail/plateau-detail.component';
import { PlateauUpdateComponent } from '../update/plateau-update.component';
import { PlateauRoutingResolveService } from './plateau-routing-resolve.service';

const plateauRoute: Routes = [
  {
    path: '',
    component: PlateauComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PlateauDetailComponent,
    resolve: {
      plateau: PlateauRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PlateauUpdateComponent,
    resolve: {
      plateau: PlateauRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PlateauUpdateComponent,
    resolve: {
      plateau: PlateauRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(plateauRoute)],
  exports: [RouterModule],
})
export class PlateauRoutingModule {}
