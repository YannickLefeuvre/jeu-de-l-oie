import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IReponse, Reponse } from '../reponse.model';

import { ReponseService } from './reponse.service';

describe('Reponse Service', () => {
  let service: ReponseService;
  let httpMock: HttpTestingController;
  let elemDefault: IReponse;
  let expectedResult: IReponse | IReponse[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ReponseService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      question: 'AAAAAAA',
      reponse: 'AAAAAAA',
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

    it('should create a Reponse', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Reponse()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Reponse', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          question: 'BBBBBB',
          reponse: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Reponse', () => {
      const patchObject = Object.assign(
        {
          question: 'BBBBBB',
        },
        new Reponse()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Reponse', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          question: 'BBBBBB',
          reponse: 'BBBBBB',
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

    it('should delete a Reponse', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addReponseToCollectionIfMissing', () => {
      it('should add a Reponse to an empty array', () => {
        const reponse: IReponse = { id: 123 };
        expectedResult = service.addReponseToCollectionIfMissing([], reponse);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reponse);
      });

      it('should not add a Reponse to an array that contains it', () => {
        const reponse: IReponse = { id: 123 };
        const reponseCollection: IReponse[] = [
          {
            ...reponse,
          },
          { id: 456 },
        ];
        expectedResult = service.addReponseToCollectionIfMissing(reponseCollection, reponse);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Reponse to an array that doesn't contain it", () => {
        const reponse: IReponse = { id: 123 };
        const reponseCollection: IReponse[] = [{ id: 456 }];
        expectedResult = service.addReponseToCollectionIfMissing(reponseCollection, reponse);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reponse);
      });

      it('should add only unique Reponse to an array', () => {
        const reponseArray: IReponse[] = [{ id: 123 }, { id: 456 }, { id: 73549 }];
        const reponseCollection: IReponse[] = [{ id: 123 }];
        expectedResult = service.addReponseToCollectionIfMissing(reponseCollection, ...reponseArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const reponse: IReponse = { id: 123 };
        const reponse2: IReponse = { id: 456 };
        expectedResult = service.addReponseToCollectionIfMissing([], reponse, reponse2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reponse);
        expect(expectedResult).toContain(reponse2);
      });

      it('should accept null and undefined values', () => {
        const reponse: IReponse = { id: 123 };
        expectedResult = service.addReponseToCollectionIfMissing([], null, reponse, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reponse);
      });

      it('should return initial array if no Reponse is added', () => {
        const reponseCollection: IReponse[] = [{ id: 123 }];
        expectedResult = service.addReponseToCollectionIfMissing(reponseCollection, undefined, null);
        expect(expectedResult).toEqual(reponseCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
