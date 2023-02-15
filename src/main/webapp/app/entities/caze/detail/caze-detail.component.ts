import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICaze } from '../caze.model';

@Component({
  selector: 'jhi-caze-detail',
  templateUrl: './caze-detail.component.html',
})
export class CazeDetailComponent implements OnInit {
  caze: ICaze | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ caze }) => {
      this.caze = caze;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
