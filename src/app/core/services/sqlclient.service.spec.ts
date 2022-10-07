import { TestBed } from '@angular/core/testing';
import { SQLClientService } from './sqlclient.service';

describe('SQLClientService', () => {
  let service: SQLClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SQLClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
