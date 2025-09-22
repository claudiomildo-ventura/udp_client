import { TestBed } from '@angular/core/testing';

import { ArchetypeService } from './archetype.service';

describe('ArchetypeService', () => {
  let service: ArchetypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArchetypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
