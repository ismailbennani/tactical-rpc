import { TestBed } from '@angular/core/testing';

import { PlayerCustomizationService } from './player-customization.service';

describe('PlayerCustomizationService', () => {
  let service: PlayerCustomizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerCustomizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
