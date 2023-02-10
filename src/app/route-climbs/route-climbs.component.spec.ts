import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteClimbsComponent } from './route-climbs.component';

describe('RouteClimbsComponent', () => {
  let component: RouteClimbsComponent;
  let fixture: ComponentFixture<RouteClimbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteClimbsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteClimbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
