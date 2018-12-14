import { TestBed, async, inject } from '@angular/core/testing';

import { ConnectAuthGuard } from './connect-auth.guard';

describe('ConnectAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConnectAuthGuard]
    });
  });

  it('should ...', inject([ConnectAuthGuard], (guard: ConnectAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
