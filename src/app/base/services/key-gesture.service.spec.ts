import { TestBed } from '@angular/core/testing';

import { KeyGestureService } from './key-gesture.service';

describe('KeyGestureService', () => {
  let service: KeyGestureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyGestureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
