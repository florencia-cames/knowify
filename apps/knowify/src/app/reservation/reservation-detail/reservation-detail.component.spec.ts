import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReservationResumeComponent } from './reservation-detail.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CancelButtonDirective } from '../../directives/cancel-button-directive';
import { Reservation, ReservationStatus } from '../reservation.interfaces';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateService } from '../../services/dates.services';
import { ReservationService } from '../reservation.service';

describe('ReservationResumeComponent', () => {
  let component: ReservationResumeComponent;
  let fixture: ComponentFixture<ReservationResumeComponent>;
  let mockRouter: Router;
  let mockActivatedRoute: ActivatedRoute;
  let mockReservationService: ReservationService;
  let mockDateService: DateService;
  let mockSnackBar: MatSnackBar;

  const mockResponseReservation: Reservation = {
    id: 1,
    name: 'Flor',
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
    status: ReservationStatus.PENDING,
    hashId: '8d74ee0e-cd0f-48f1-a981-45c3eedea826',
  };

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(),
    } as unknown as Router;

    mockActivatedRoute = {
      data: of({ data: { reservation: mockResponseReservation, region: { id: 1, name: 'Mock Region' } } }),
    } as unknown as ActivatedRoute;

    mockReservationService = {
      checkAvailability: jest.fn(() => of(true)),
      updateReservationStatus: jest.fn(() => of(true)),
    } as unknown as ReservationService;

    mockDateService = {
      formatDate: jest.fn((date: Date) => date.toISOString()),
    } as unknown as DateService;

    mockSnackBar = {
      open: jest.fn(),
    } as unknown as MatSnackBar;

    await TestBed.configureTestingModule({
      imports: [MatButtonModule, MatIconModule, CancelButtonDirective, ReservationResumeComponent, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ReservationService, useValue: mockReservationService },
        { provide: DateService, useValue: mockDateService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should display reservation details when reservation is available', () => {
    fixture.detectChanges();
    const headingElements = fixture.debugElement.queryAll(By.css('h3'));
    const nameElement = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(headingElements[0].nativeElement.textContent).toContain('Personal Details');
    expect(nameElement.textContent).toContain('Name: Flor');
  });

  it('should navigate to reservations if no reservation data is provided', () => {
    jest.spyOn(mockRouter, 'navigate');
    mockActivatedRoute.data = of({ data: { reservation: null, region: null } }); // Simulate no data
    fixture.detectChanges();
    component.ngOnInit();
    fixture.detectChanges();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/reservations']);
  });
});
