import { DataProviderService } from '../src/app/services/data-provider.service';
import {TestBed} from "@angular/core/testing";

describe('DataProviderService', () => {
  let service: DataProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
