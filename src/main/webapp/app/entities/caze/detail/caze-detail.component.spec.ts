import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CazeDetailComponent } from './caze-detail.component';

describe('Caze Management Detail Component', () => {
  let comp: CazeDetailComponent;
  let fixture: ComponentFixture<CazeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CazeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ caze: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CazeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CazeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load caze on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.caze).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
