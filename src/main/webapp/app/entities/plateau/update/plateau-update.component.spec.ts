import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PlateauService } from '../service/plateau.service';
import { IPlateau, Plateau } from '../plateau.model';

import { PlateauUpdateComponent } from './plateau-update.component';

describe('Plateau Management Update Component', () => {
  let comp: PlateauUpdateComponent;
  let fixture: ComponentFixture<PlateauUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let plateauService: PlateauService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PlateauUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PlateauUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PlateauUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    plateauService = TestBed.inject(PlateauService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const plateau: IPlateau = { id: 456 };

      activatedRoute.data = of({ plateau });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(plateau));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Plateau>>();
      const plateau = { id: 123 };
      jest.spyOn(plateauService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plateau });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: plateau }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(plateauService.update).toHaveBeenCalledWith(plateau);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Plateau>>();
      const plateau = new Plateau();
      jest.spyOn(plateauService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plateau });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: plateau }));
      saveSubject.complete();

      // THEN
      expect(plateauService.create).toHaveBeenCalledWith(plateau);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Plateau>>();
      const plateau = { id: 123 };
      jest.spyOn(plateauService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plateau });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(plateauService.update).toHaveBeenCalledWith(plateau);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
