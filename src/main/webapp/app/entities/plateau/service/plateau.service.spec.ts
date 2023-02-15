import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPlateau, Plateau } from '../plateau.model';

import { PlateauService } from './plateau.service';

describe('Plateau Service', () => {
  let service: PlateauService;
  let httpMock: HttpTestingController;
  let elemDefault: IPlateau;
  let expectedResult: IPlateau | IPlateau[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PlateauService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nom: 'AAAAAAA',
      imageContentType: 'image/png',
      image: 'AAAAAAA',
      nbQuestions: 0,
      principal: false,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Plateau', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Plateau()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Plateau', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nom: 'BBBBBB',
          image: 'BBBBBB',
          nbQuestions: 1,
          principal: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Plateau', () => {
      const patchObject = Object.assign(
        {
          image: 'BBBBBB',
          nbQuestions: 1,
        },
        new Plateau()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Plateau', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nom: 'BBBBBB',
          image: 'BBBBBB',
          nbQuestions: 1,
          principal: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Plateau', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPlateauToCollectionIfMissing', () => {
      it('should add a Plateau to an empty array', () => {
        const plateau: IPlateau = { id: 123 };
        expectedResult = service.addPlateauToCollectionIfMissing([], plateau);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(plateau);
      });

      it('should not add a Plateau to an array that contains it', () => {
        const plateau: IPlateau = { id: 123 };
        const plateauCollection: IPlateau[] = [
          {
            ...plateau,
          },
          { id: 456 },
        ];
        expectedResult = service.addPlateauToCollectionIfMissing(plateauCollection, plateau);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Plateau to an array that doesn't contain it", () => {
        const plateau: IPlateau = { id: 123 };
        const plateauCollection: IPlateau[] = [{ id: 456 }];
        expectedResult = service.addPlateauToCollectionIfMissing(plateauCollection, plateau);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(plateau);
      });

      it('should add only unique Plateau to an array', () => {
        const plateauArray: IPlateau[] = [{ id: 123 }, { id: 456 }, { id: 70226 }];
        const plateauCollection: IPlateau[] = [{ id: 123 }];
        expectedResult = service.addPlateauToCollectionIfMissing(plateauCollection, ...plateauArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const plateau: IPlateau = { id: 123 };
        const plateau2: IPlateau = { id: 456 };
        expectedResult = service.addPlateauToCollectionIfMissing([], plateau, plateau2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(plateau);
        expect(expectedResult).toContain(plateau2);
      });

      it('should accept null and undefined values', () => {
        const plateau: IPlateau = { id: 123 };
        expectedResult = service.addPlateauToCollectionIfMissing([], null, plateau, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(plateau);
      });

      it('should return initial array if no Plateau is added', () => {
        const plateauCollection: IPlateau[] = [{ id: 123 }];
        expectedResult = service.addPlateauToCollectionIfMissing(plateauCollection, undefined, null);
        expect(expectedResult).toEqual(plateauCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
