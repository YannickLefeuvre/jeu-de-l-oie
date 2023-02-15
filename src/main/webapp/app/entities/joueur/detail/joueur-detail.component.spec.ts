import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JoueurDetailComponent } from './joueur-detail.component';

describe('Joueur Management Detail Component', () => {
  let comp: JoueurDetailComponent;
  let fixture: ComponentFixture<JoueurDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoueurDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ joueur: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(JoueurDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(JoueurDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load joueur on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.joueur).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
