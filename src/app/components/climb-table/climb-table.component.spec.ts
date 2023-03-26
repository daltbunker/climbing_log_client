import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimbTableComponent } from './climb-table.component';

describe('ClimbTableComponent', () => {
  let component: ClimbTableComponent;
  let fixture: ComponentFixture<ClimbTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClimbTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClimbTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
