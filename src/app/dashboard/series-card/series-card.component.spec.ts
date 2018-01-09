import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { mockSeries } from '../../common/test/series.mock';
import { SeriesCardComponent } from './series-card.component';

describe('SeriesComponent', () => {
  let component: SeriesCardComponent;
  let fixture: ComponentFixture<SeriesCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeriesCardComponent],
      imports: [
        RouterTestingModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesCardComponent);
    component = fixture.componentInstance;
    component.series = mockSeries[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});