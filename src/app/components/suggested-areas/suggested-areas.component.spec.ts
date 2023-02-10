import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedAreasComponent } from './suggested-areas.component';

describe('SuggestedAreasComponent', () => {
  let component: SuggestedAreasComponent;
  let fixture: ComponentFixture<SuggestedAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuggestedAreasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuggestedAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
