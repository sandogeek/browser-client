import { TestBed } from '@angular/core/testing';

import { WebSocketSubjectServiceService } from './web-socket-subject-service.service';

describe('WebSocketSubjectServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebSocketSubjectServiceService = TestBed.get(WebSocketSubjectServiceService);
    expect(service).toBeTruthy();
  });
});
