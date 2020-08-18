import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterColumnsComponent } from './filter-columns.component';

describe('FilterColumnsComponent', () => {
  let component: FilterColumnsComponent;
  let fixture: ComponentFixture<FilterColumnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterColumnsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
