import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitIndicatorComponent } from './wait-indicator.component';

describe('WaitIndicatorComponent', () => {
  let component: WaitIndicatorComponent;
  let fixture: ComponentFixture<WaitIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaitIndicatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
