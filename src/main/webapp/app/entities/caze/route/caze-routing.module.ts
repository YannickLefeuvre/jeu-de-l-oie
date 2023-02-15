import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CazeComponent } from '../list/caze.component';
import { CazeDetailComponent } from '../detail/caze-detail.component';
import { CazeUpdateComponent } from '../update/caze-update.component';
import { CazeRoutingResolveService } from './caze-routing-resolve.service';

const cazeRoute: Routes = [
  {
    path: '',
    component: CazeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CazeDetailComponent,
    resolve: {
      caze: CazeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CazeUpdateComponent,
    resolve: {
      caze: CazeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CazeUpdateComponent,
    resolve: {
      caze: CazeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(cazeRoute)],
  exports: [RouterModule],
})
export class CazeRoutingModule {}
