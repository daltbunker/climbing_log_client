import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AscentFormComponent } from './ascent-form.component';

describe('AscentFormComponent', () => {
  let component: AscentFormComponent;
  let fixture: ComponentFixture<AscentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AscentFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AscentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
