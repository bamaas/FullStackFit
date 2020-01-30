import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TdeeResultsComponent } from './tdee-results.component';

describe('TdeeResultsComponent', () => {
  let component: TdeeResultsComponent;
  let fixture: ComponentFixture<TdeeResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TdeeResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TdeeResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
