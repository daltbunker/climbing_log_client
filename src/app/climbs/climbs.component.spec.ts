import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimbsComponent } from './climbs.component';

describe('ClimbsComponent', () => {
  let component: ClimbsComponent;
  let fixture: ComponentFixture<ClimbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClimbsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClimbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
