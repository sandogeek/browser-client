import { TestBed, async, inject } from '@angular/core/testing';

import { ChooseRoleGuard } from './choose-role.guard';

describe('ChooseRoleGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChooseRoleGuard]
    });
  });

  it('should ...', inject([ChooseRoleGuard], (guard: ChooseRoleGuard) => {
    expect(guard).toBeTruthy();
  }));
});
