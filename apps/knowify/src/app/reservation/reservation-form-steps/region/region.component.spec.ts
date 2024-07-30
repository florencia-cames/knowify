import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegionComponent } from './region.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReservationService } from '../../reservation.service';
import { DateService } from '../../../services/dates.services';
import { MatSelectModule } from '@angular/material/select';
import {
  Region,
  Reservation,
  SuggestionResponse,
} from '../../reservation.interfaces';
import { By } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule

describe('RegionComponent', () => {
  let component: RegionComponent;
  let fixture: ComponentFixture<RegionComponent>;
  let reservationService: jest.Mocked<ReservationService>;
  let dateService: jest.Mocked<DateService>;
  let router: jest.Mocked<Router>;
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

  beforeEach(async () => {
    reservationService = {
      stepChange$: of(null),
      getRegions: jest.fn(),
      checkAvailability: jest.fn().mockReturnValue(of(true)),
      suggestAlternativeDates: jest.fn(),
      createReservation: jest.fn(),
      updateReservation: jest.fn(),
    } as unknown as jest.Mocked<ReservationService>;

    dateService = {
      formatDateToYYYYMMDD: jest.fn(),
    } as unknown as jest.Mocked<DateService>;

    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSelectModule,
        RegionComponent,
        BrowserAnimationsModule,
      ],
      providers: [
        FormBuilder,
        { provide: ReservationService, useValue: reservationService },
        { provide: DateService, useValue: dateService },
        { provide: Router, useValue: router },
        { provide: MatStepper, useValue: {} },
        { provide: MatDialog, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionComponent);
    component = fixture.componentInstance;
    component.regionFormGroup = new FormBuilder().group({
      region: [1],
    });
    fixture.detectChanges();
  });

  it('should display the form when alternativeDates is empty', () => {
    component.alternativeDates = [];
    component.availableRegions = [mockResponseRegions[0]];
    fixture.detectChanges();
    const formElement = fixture.debugElement.query(By.css('.region-form'));
    expect(formElement).toBeTruthy();
  });

  it('should not display the form when alternativeDates has items', () => {
    component.alternativeDates = [
      { date: '2024-07-01', region: mockResponseRegions[0] },
    ];
    fixture.detectChanges();
    const formElement = fixture.debugElement.query(By.css('.region-form'));
    expect(formElement).toBeNull();
  });

  it('should call checkAvaibility when form is submitted', () => {
    const checkAvailabilitySpy = jest.spyOn(component, 'checkAvaibility');
    component.regionFormGroup = new FormBuilder().group({
      region: [1],
    });
    component.alternativeDates = [];
    fixture.detectChanges();
    const formElement = fixture.debugElement.query(By.css('form'));
    formElement.triggerEventHandler('ngSubmit', null);
    expect(checkAvailabilitySpy).toHaveBeenCalled();
  });

  it('should call checkAvaibilitySuggestion when dateSelected event is emitted', () => {
    const checkAvaibilitySuggestionSpy = jest.spyOn(
      component,
      'checkAvaibilitySuggestion'
    );
    const suggestionResponse: SuggestionResponse = {
      date: '2024-07-01',
      region: mockResponseRegions[0],
    };
    component.alternativeDates = [suggestionResponse];
    component.reservation = mockResponseReservation;
    fixture.detectChanges();
    component.checkAvaibilitySuggestion(suggestionResponse);
    expect(checkAvaibilitySuggestionSpy).toHaveBeenCalledWith(
      suggestionResponse
    );
  });

  it('should navigate to reservation page on successful reservation creation', () => {
    reservationService.checkAvailability.mockReturnValue(of(true));
    reservationService.updateReservation.mockReturnValue(
      of(mockResponseReservation)
    );
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.regionFormGroup = new FormBuilder().group({
      region: [1],
    });
    component.reservation = mockResponseReservation;
    fixture.detectChanges();
    component.checkAvaibility();
    expect(navigateSpy).toHaveBeenCalledWith([
      '/reservation',
      '8d74ee0e-cd0f-48f1-a981-45c3eedea826',
    ]);
  });
});
