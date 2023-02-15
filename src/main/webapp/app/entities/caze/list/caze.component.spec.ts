import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CazeService } from '../service/caze.service';

import { CazeComponent } from './caze.component';

describe('Caze Management Component', () => {
  let comp: CazeComponent;
  let fixture: ComponentFixture<CazeComponent>;
  let service: CazeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CazeComponent],
    })
      .overrideTemplate(CazeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CazeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CazeService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.cazes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
