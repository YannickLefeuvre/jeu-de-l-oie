import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ReponseService } from '../service/reponse.service';
import { IReponse, Reponse } from '../reponse.model';
import { IJoueur } from 'app/entities/joueur/joueur.model';
import { JoueurService } from 'app/entities/joueur/service/joueur.service';

import { ReponseUpdateComponent } from './reponse-update.component';

describe('Reponse Management Update Component', () => {
  let comp: ReponseUpdateComponent;
  let fixture: ComponentFixture<ReponseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let reponseService: ReponseService;
  let joueurService: JoueurService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ReponseUpdateComponent],
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
      .overrideTemplate(ReponseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReponseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    reponseService = TestBed.inject(ReponseService);
    joueurService = TestBed.inject(JoueurService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Joueur query and add missing value', () => {
      const reponse: IReponse = { id: 456 };
      const user: IJoueur = { id: 75527 };
      reponse.user = user;

      const joueurCollection: IJoueur[] = [{ id: 68319 }];
      jest.spyOn(joueurService, 'query').mockReturnValue(of(new HttpResponse({ body: joueurCollection })));
      const additionalJoueurs = [user];
      const expectedCollection: IJoueur[] = [...additionalJoueurs, ...joueurCollection];
      jest.spyOn(joueurService, 'addJoueurToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reponse });
      comp.ngOnInit();

      expect(joueurService.query).toHaveBeenCalled();
      expect(joueurService.addJoueurToCollectionIfMissing).toHaveBeenCalledWith(joueurCollection, ...additionalJoueurs);
      expect(comp.joueursSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const reponse: IReponse = { id: 456 };
      const user: IJoueur = { id: 30284 };
      reponse.user = user;

      activatedRoute.data = of({ reponse });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(reponse));
      expect(comp.joueursSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Reponse>>();
      const reponse = { id: 123 };
      jest.spyOn(reponseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reponse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reponse }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(reponseService.update).toHaveBeenCalledWith(reponse);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Reponse>>();
      const reponse = new Reponse();
      jest.spyOn(reponseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reponse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reponse }));
      saveSubject.complete();

      // THEN
      expect(reponseService.create).toHaveBeenCalledWith(reponse);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Reponse>>();
      const reponse = { id: 123 };
      jest.spyOn(reponseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reponse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(reponseService.update).toHaveBeenCalledWith(reponse);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackJoueurById', () => {
      it('Should return tracked Joueur primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackJoueurById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
