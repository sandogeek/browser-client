import { TestBed, async, inject } from '@angular/core/testing';

import { GamingGuard } from './gaming.guard';

describe('GamingGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GamingGuard]
    });
  });

  it('should ...', inject([GamingGuard], (guard: GamingGuard) => {
    expect(guard).toBeTruthy();
  }));
});
