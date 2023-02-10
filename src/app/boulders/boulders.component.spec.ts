import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BouldersComponent } from './boulders.component';

describe('BouldersComponent', () => {
  let component: BouldersComponent;
  let fixture: ComponentFixture<BouldersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BouldersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BouldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
