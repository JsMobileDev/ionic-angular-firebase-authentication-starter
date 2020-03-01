import { TestBed } from '@angular/core/testing';

import { PushNotificationsService } from './push-notifications.service';

describe('PushNotificationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PushNotificationsService = TestBed.get(PushNotificationsService);
    expect(service).toBeTruthy();
  });
});
