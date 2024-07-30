import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';
import { BehaviorSubject } from 'rxjs';

describe('LoadingService', () => {
  let service: LoadingService;
  let mockLoadingSubject: jest.Mocked<BehaviorSubject<boolean>>;
  let loadingSubject: BehaviorSubject<boolean>;

  beforeEach(() => {
    // Crear una instancia mock de BehaviorSubject
    mockLoadingSubject = {
      next: jest.fn(),
      setLoading: jest.fn((loading: boolean) => loadingSubject.next(loading)),
    } as unknown as jest.Mocked<BehaviorSubject<boolean>>;

    TestBed.configureTestingModule({
      providers: [
        LoadingService,
        { provide: BehaviorSubject, useValue: mockLoadingSubject },
      ],
    });

    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a loading$ observable', () => {
    expect(service.loading$).toBeDefined();
  });
});
