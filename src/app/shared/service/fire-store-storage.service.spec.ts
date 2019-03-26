import { TestBed } from '@angular/core/testing';

import { FireStoreStorageService } from './fire-store-storage.service';

describe('FireStoreStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FireStoreStorageService = TestBed.get(FireStoreStorageService);
    expect(service).toBeTruthy();
  });
});
