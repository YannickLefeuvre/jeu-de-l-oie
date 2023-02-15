import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CazeService } from '../service/caze.service';
import { ICaze, Caze } from '../caze.model';
import { IPlateau } from 'app/entities/plateau/plateau.model';
import { PlateauService } from 'app/entities/plateau/service/plateau.service';

import { CazeUpdateComponent } from './caze-update.component';

describe('Caze Management Update Component', () => {
  let comp: CazeUpdateComponent;
  let fixture: ComponentFixture<CazeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let cazeService: CazeService;
  let plateauService: PlateauService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CazeUpdateComponent],
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
      .overrideTemplate(CazeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CazeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    cazeService = TestBed.inject(CazeService);
    plateauService = TestBed.inject(PlateauService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Plateau query and add missing value', () => {
      const caze: ICaze = { id: 456 };
      const plateau: IPlateau = { id: 53986 };
      caze.plateau = plateau;

      const plateauCollection: IPlateau[] = [{ id: 6612 }];
      jest.spyOn(plateauService, 'query').mockReturnValue(of(new HttpResponse({ body: plateauCollection })));
      const additionalPlateaus = [plateau];
      const expectedCollection: IPlateau[] = [...additionalPlateaus, ...plateauCollection];
      jest.spyOn(plateauService, 'addPlateauToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ caze });
      comp.ngOnInit();

      expect(plateauService.query).toHaveBeenCalled();
      expect(plateauService.addPlateauToCollectionIfMissing).toHaveBeenCalledWith(plateauCollection, ...additionalPlateaus);
      expect(comp.plateausSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const caze: ICaze = { id: 456 };
      const plateau: IPlateau = { id: 6285 };
      caze.plateau = plateau;

      activatedRoute.data = of({ caze });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(caze));
      expect(comp.plateausSharedCollection).toContain(plateau);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Caze>>();
      const caze = { id: 123 };
      jest.spyOn(cazeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ caze });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: caze }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(cazeService.update).toHaveBeenCalledWith(caze);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Caze>>();
      const caze = new Caze();
      jest.spyOn(cazeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ caze });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: caze }));
      saveSubject.complete();

      // THEN
      expect(cazeService.create).toHaveBeenCalledWith(caze);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Caze>>();
      const caze = { id: 123 };
      jest.spyOn(cazeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ caze });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(cazeService.update).toHaveBeenCalledWith(caze);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackPlateauById', () => {
      it('Should return tracked Plateau primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPlateauById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
