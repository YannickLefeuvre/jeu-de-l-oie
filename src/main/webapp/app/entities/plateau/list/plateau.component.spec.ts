import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PlateauService } from '../service/plateau.service';

import { PlateauComponent } from './plateau.component';

describe('Plateau Management Component', () => {
  let comp: PlateauComponent;
  let fixture: ComponentFixture<PlateauComponent>;
  let service: PlateauService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PlateauComponent],
    })
      .overrideTemplate(PlateauComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PlateauComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PlateauService);

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
    expect(comp.plateaus?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
