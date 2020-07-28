import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SceduleCalendarComponent } from './scedule-calendar.component';

describe('SceduleCalendarComponent', () => {
  let component: SceduleCalendarComponent;
  let fixture: ComponentFixture<SceduleCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SceduleCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SceduleCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
