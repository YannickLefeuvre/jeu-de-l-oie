import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'joueur',
        data: { pageTitle: 'elitysApp.joueur.home.title' },
        loadChildren: () => import('./joueur/joueur.module').then(m => m.JoueurModule),
      },
      {
        path: 'plateau',
        data: { pageTitle: 'elitysApp.plateau.home.title' },
        loadChildren: () => import('./plateau/plateau.module').then(m => m.PlateauModule),
      },
      {
        path: 'reponse',
        data: { pageTitle: 'elitysApp.reponse.home.title' },
        loadChildren: () => import('./reponse/reponse.module').then(m => m.ReponseModule),
      },
      {
        path: 'caze',
        data: { pageTitle: 'elitysApp.caze.home.title' },
        loadChildren: () => import('./caze/caze.module').then(m => m.CazeModule),
      },
      {
        path: 'application-user',
        data: { pageTitle: 'elitysApp.applicationUser.home.title' },
        loadChildren: () => import('./application-user/application-user.module').then(m => m.ApplicationUserModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
