import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ReponseDetailComponent } from './reponse-detail.component';

describe('Reponse Management Detail Component', () => {
  let comp: ReponseDetailComponent;
  let fixture: ComponentFixture<ReponseDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReponseDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ reponse: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ReponseDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ReponseDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load reponse on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.reponse).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
