import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { JoueurService } from '../service/joueur.service';
import { IJoueur, Joueur } from '../joueur.model';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';
import { ICaze } from 'app/entities/caze/caze.model';
import { CazeService } from 'app/entities/caze/service/caze.service';
import { IPlateau } from 'app/entities/plateau/plateau.model';
import { PlateauService } from 'app/entities/plateau/service/plateau.service';

import { JoueurUpdateComponent } from './joueur-update.component';

describe('Joueur Management Update Component', () => {
  let comp: JoueurUpdateComponent;
  let fixture: ComponentFixture<JoueurUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let joueurService: JoueurService;
  let applicationUserService: ApplicationUserService;
  let cazeService: CazeService;
  let plateauService: PlateauService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [JoueurUpdateComponent],
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
      .overrideTemplate(JoueurUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JoueurUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    joueurService = TestBed.inject(JoueurService);
    applicationUserService = TestBed.inject(ApplicationUserService);
    cazeService = TestBed.inject(CazeService);
    plateauService = TestBed.inject(PlateauService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ApplicationUser query and add missing value', () => {
      const joueur: IJoueur = { id: 456 };
      const user: IApplicationUser = { id: 87477 };
      joueur.user = user;

      const applicationUserCollection: IApplicationUser[] = [{ id: 99113 }];
      jest.spyOn(applicationUserService, 'query').mockReturnValue(of(new HttpResponse({ body: applicationUserCollection })));
      const additionalApplicationUsers = [user];
      const expectedCollection: IApplicationUser[] = [...additionalApplicationUsers, ...applicationUserCollection];
      jest.spyOn(applicationUserService, 'addApplicationUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ joueur });
      comp.ngOnInit();

      expect(applicationUserService.query).toHaveBeenCalled();
      expect(applicationUserService.addApplicationUserToCollectionIfMissing).toHaveBeenCalledWith(
        applicationUserCollection,
        ...additionalApplicationUsers
      );
      expect(comp.applicationUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Caze query and add missing value', () => {
      const joueur: IJoueur = { id: 456 };
      const caze: ICaze = { id: 43663 };
      joueur.caze = caze;

      const cazeCollection: ICaze[] = [{ id: 68924 }];
      jest.spyOn(cazeService, 'query').mockReturnValue(of(new HttpResponse({ body: cazeCollection })));
      const additionalCazes = [caze];
      const expectedCollection: ICaze[] = [...additionalCazes, ...cazeCollection];
      jest.spyOn(cazeService, 'addCazeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ joueur });
      comp.ngOnInit();

      expect(cazeService.query).toHaveBeenCalled();
      expect(cazeService.addCazeToCollectionIfMissing).toHaveBeenCalledWith(cazeCollection, ...additionalCazes);
      expect(comp.cazesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Plateau query and add missing value', () => {
      const joueur: IJoueur = { id: 456 };
      const plateau: IPlateau = { id: 86410 };
      joueur.plateau = plateau;

      const plateauCollection: IPlateau[] = [{ id: 79863 }];
      jest.spyOn(plateauService, 'query').mockReturnValue(of(new HttpResponse({ body: plateauCollection })));
      const additionalPlateaus = [plateau];
      const expectedCollection: IPlateau[] = [...additionalPlateaus, ...plateauCollection];
      jest.spyOn(plateauService, 'addPlateauToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ joueur });
      comp.ngOnInit();

      expect(plateauService.query).toHaveBeenCalled();
      expect(plateauService.addPlateauToCollectionIfMissing).toHaveBeenCalledWith(plateauCollection, ...additionalPlateaus);
      expect(comp.plateausSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const joueur: IJoueur = { id: 456 };
      const user: IApplicationUser = { id: 46374 };
      joueur.user = user;
      const caze: ICaze = { id: 74677 };
      joueur.caze = caze;
      const plateau: IPlateau = { id: 67610 };
      joueur.plateau = plateau;

      activatedRoute.data = of({ joueur });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(joueur));
      expect(comp.applicationUsersSharedCollection).toContain(user);
      expect(comp.cazesSharedCollection).toContain(caze);
      expect(comp.plateausSharedCollection).toContain(plateau);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Joueur>>();
      const joueur = { id: 123 };
      jest.spyOn(joueurService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ joueur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: joueur }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(joueurService.update).toHaveBeenCalledWith(joueur);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Joueur>>();
      const joueur = new Joueur();
      jest.spyOn(joueurService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ joueur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: joueur }));
      saveSubject.complete();

      // THEN
      expect(joueurService.create).toHaveBeenCalledWith(joueur);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Joueur>>();
      const joueur = { id: 123 };
      jest.spyOn(joueurService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ joueur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(joueurService.update).toHaveBeenCalledWith(joueur);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackApplicationUserById', () => {
      it('Should return tracked ApplicationUser primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackApplicationUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackCazeById', () => {
      it('Should return tracked Caze primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCazeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackPlateauById', () => {
      it('Should return tracked Plateau primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPlateauById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
