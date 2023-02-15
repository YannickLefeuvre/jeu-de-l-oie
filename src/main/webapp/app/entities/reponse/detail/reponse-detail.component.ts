import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IReponse } from '../reponse.model';

@Component({
  selector: 'jhi-reponse-detail',
  templateUrl: './reponse-detail.component.html',
})
export class ReponseDetailComponent implements OnInit {
  reponse: IReponse | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reponse }) => {
      this.reponse = reponse;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
