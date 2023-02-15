import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICaze, Caze } from '../caze.model';

import { CazeService } from './caze.service';

describe('Caze Service', () => {
  let service: CazeService;
  let httpMock: HttpTestingController;
  let elemDefault: ICaze;
  let expectedResult: ICaze | ICaze[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CazeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      question: 'AAAAAAA',
      absice: 0,
      ordo: 0,
      position: 0,
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

    it('should create a Caze', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Caze()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Caze', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          question: 'BBBBBB',
          absice: 1,
          ordo: 1,
          position: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Caze', () => {
      const patchObject = Object.assign(
        {
          question: 'BBBBBB',
        },
        new Caze()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Caze', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          question: 'BBBBBB',
          absice: 1,
          ordo: 1,
          position: 1,
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

    it('should delete a Caze', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCazeToCollectionIfMissing', () => {
      it('should add a Caze to an empty array', () => {
        const caze: ICaze = { id: 123 };
        expectedResult = service.addCazeToCollectionIfMissing([], caze);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(caze);
      });

      it('should not add a Caze to an array that contains it', () => {
        const caze: ICaze = { id: 123 };
        const cazeCollection: ICaze[] = [
          {
            ...caze,
          },
          { id: 456 },
        ];
        expectedResult = service.addCazeToCollectionIfMissing(cazeCollection, caze);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Caze to an array that doesn't contain it", () => {
        const caze: ICaze = { id: 123 };
        const cazeCollection: ICaze[] = [{ id: 456 }];
        expectedResult = service.addCazeToCollectionIfMissing(cazeCollection, caze);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(caze);
      });

      it('should add only unique Caze to an array', () => {
        const cazeArray: ICaze[] = [{ id: 123 }, { id: 456 }, { id: 57835 }];
        const cazeCollection: ICaze[] = [{ id: 123 }];
        expectedResult = service.addCazeToCollectionIfMissing(cazeCollection, ...cazeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const caze: ICaze = { id: 123 };
        const caze2: ICaze = { id: 456 };
        expectedResult = service.addCazeToCollectionIfMissing([], caze, caze2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(caze);
        expect(expectedResult).toContain(caze2);
      });

      it('should accept null and undefined values', () => {
        const caze: ICaze = { id: 123 };
        expectedResult = service.addCazeToCollectionIfMissing([], null, caze, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(caze);
      });

      it('should return initial array if no Caze is added', () => {
        const cazeCollection: ICaze[] = [{ id: 123 }];
        expectedResult = service.addCazeToCollectionIfMissing(cazeCollection, undefined, null);
        expect(expectedResult).toEqual(cazeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
