import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabbedGroupComponent } from './tabbed-group.component';

describe('TabbedGroupComponent', () => {
  let component: TabbedGroupComponent;
  let fixture: ComponentFixture<TabbedGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TabbedGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabbedGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
