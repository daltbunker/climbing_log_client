import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimbFormComponent } from './climb-form.component';

describe('ClimbFormComponent', () => {
  let component: ClimbFormComponent;
  let fixture: ComponentFixture<ClimbFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClimbFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClimbFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
