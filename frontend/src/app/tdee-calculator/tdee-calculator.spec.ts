import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { tdeeCalculator } from './tdee-calculator.component';

describe('tdeeCalculator', () => {
  let component: tdeeCalculator;
  let fixture: ComponentFixture<tdeeCalculator>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ tdeeCalculator ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(tdeeCalculator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
