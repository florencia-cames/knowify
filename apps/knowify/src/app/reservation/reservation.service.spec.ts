import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ReservationService } from './reservation.service';
import { Dialogservice } from '../dialogs/dialogs.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import {
  Region,
  Reservation,
  ReservationStatus,
  SuggestionResponse,
} from './reservation.interfaces';

describe('ReservationService', () => {
  let service: ReservationService;
  let httpMock: HttpTestingController;
  let dialogServiceMock: jest.Mocked<Dialogservice>;
  let snackBarMock: jest.Mocked<MatSnackBar>;
  let routerMock: jest.Mocked<Router>;
  let mockReservation: Reservation = {
    id: 0,
    name: 'flor',
    email: 'flor@gmail.com',
    phoneNumber: '1234567890',
    partySize: 10,
    childrenCount: 0,
    smoking: false,
    birthday: false,
    birthdayName: '',
    date: '2024-07-30',
    time: '20:00',
    region: 1,
    status: 1,
    hashId: '',
  };
  let mockResponseReservation: Reservation = {
    id: 1,
    name: 'flor',
    email: 'flor@gmail.com',
    phoneNumber: '1234567890',
    partySize: 10,
    childrenCount: 0,
    smoking: false,
    birthday: false,
    birthdayName: '',
    date: '2024-07-30',
    time: '20:00',
    region: 1,
    status: 1,
    hashId: '8d74ee0e-cd0f-48f1-a981-45c3eedea826',
  };

  let mockResponseRegions: Region[] = [
    {
      id: 1,
      name: 'Main Hall',
      seatingCapacity: 12,
      childrenAllowed: true,
      smokingAllowed: false,
    },
    {
      id: 2,
      name: 'Bar',
      seatingCapacity: 4,
      childrenAllowed: false,
      smokingAllowed: false,
    },
    {
      id: 3,
      name: 'Riverside',
      seatingCapacity: 8,
      childrenAllowed: true,
      smokingAllowed: false,
    },
    {
      id: 4,
      name: 'Riverside (smoking allowed)',
      seatingCapacity: 6,
      childrenAllowed: false,
      smokingAllowed: true,
    },
  ];

  beforeEach(() => {
    dialogServiceMock = {
      openCancelDialog: jest.fn().mockReturnValue(of(true)),
    } as unknown as jest.Mocked<Dialogservice>;

    snackBarMock = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatSnackBar>;

    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReservationService,
        { provide: Dialogservice, useValue: dialogServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    service = TestBed.inject(ReservationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check availability', () => {
    const mockResponse = true;
    service
      .checkAvailability('2024-07-25', 1, 'test@example.com')
      .subscribe((response) => {
        expect(response).toBe(mockResponse);
      });

    const req = httpMock.expectOne(
      'http://localhost:3000/api/reservations/availability?date=2024-07-25&region=1&email=test@example.com'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should suggest alternative dates', () => {
    const reservationData: Partial<Reservation> = {
      /* mock data */
    };
    const mockResponse: SuggestionResponse[] = [
      /* mock suggestions */
    ];

    service.suggestAlternativeDates(reservationData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      'http://localhost:3000/api/reservations/suggest-alternatives'
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(reservationData);
    req.flush(mockResponse);
  });

  it('should create reservation', () => {
    service.createReservation(mockReservation).subscribe((response) => {
      expect(response).toEqual(mockResponseReservation);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/reservations');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockReservation);
    req.flush(mockResponseReservation);
  });

  it('should notify step change with reservation data', () => {
    service.notifyStepChange(mockReservation);
    service.stepChange$.subscribe((response) => {
      expect(response).toEqual(mockReservation);
    });
  });

  it('should get all reservations', () => {
    const mockResponse: Reservation[] = [mockResponseReservation];

    service.getAllReservations().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/reservations');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get available dates', () => {
    const mockResponse: string[] = ['07-07-2024'];
    const expectedDates: Date[] = mockResponse.map(
      (dateStr) => new Date(dateStr)
    );

    service.getAvailableDates().subscribe((response) => {
      expect(response).toEqual(expectedDates);
    });

    const req = httpMock.expectOne(
      'http://localhost:3000/api/availability/dates'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get times', () => {
    const mockResponse: string[] = ['22:00'];

    service.getTimes().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      'http://localhost:3000/api/availability/times'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get suggestions', () => {
    const date = '2024-07-25';
    const partySize = 4;
    const smoking = false;
    const childrenCount = 2;
    const mockResponse: any[] = [
      /* mock suggestions */
    ];

    service
      .getSuggestions(date, partySize, smoking, childrenCount)
      .subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(
      `http://localhost:3000/api/availability/suggestions?date=${date}&partySize=${partySize}&smoking=${smoking}&childrenCount=${childrenCount}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get all regions and expect them to be 4', () => {
    service.getRegions().subscribe((response) => {
      expect(response).toEqual(mockResponseRegions);
      expect(response).toHaveLength(4);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/region');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponseReservation);
  });

  it('should get reservation by id', () => {
    const hashId = 'abc123';

    service.getReservationById(hashId).subscribe((response) => {
      expect(response).toEqual(mockResponseReservation);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/api/reservations/reservation/${hashId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponseReservation);
  });

  it('should update reservation status', () => {
    const hashId = 'abc123';
    const status: ReservationStatus = ReservationStatus.CONFIRMED;

    service.updateReservationStatus(hashId, status).subscribe((response) => {
      expect(response).toEqual(mockResponseReservation);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/api/reservations/reservation/${hashId}`
    );
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status });
    req.flush(mockResponseReservation);
  });

  it('should update reservation', () => {
    const hashId = 'abc123';

    service.updateReservation(hashId, mockReservation).subscribe((response) => {
      expect(response).toEqual(mockResponseReservation);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/api/reservations/reservation/${hashId}`
    );
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(mockReservation);
    req.flush(mockResponseReservation);
  });

  it('should cancel reservation correctly when confirmed', () => {
    const hashId = 'abc123';
    const deleteReservationMock = jest.fn().mockReturnValue(of(undefined));
    jest
      .spyOn(service, 'deleteReservation')
      .mockImplementation(deleteReservationMock);
    service.cancelReservation(hashId);
    expect(dialogServiceMock.openCancelDialog).toHaveBeenCalledWith(
      'Are you sure you want to cancel the reservation?'
    );
    dialogServiceMock.openCancelDialog.mockReturnValue(of(true));
    expect(deleteReservationMock).toHaveBeenCalledWith(hashId);
    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Reservation cancelled successfully',
      'ok'
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['/reservations']);
  });
});
