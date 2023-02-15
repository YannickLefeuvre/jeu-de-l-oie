import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ReponseService } from '../service/reponse.service';

import { ReponseComponent } from './reponse.component';

describe('Reponse Management Component', () => {
  let comp: ReponseComponent;
  let fixture: ComponentFixture<ReponseComponent>;
  let service: ReponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ReponseComponent],
    })
      .overrideTemplate(ReponseComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReponseComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ReponseService);

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
    expect(comp.reponses?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
