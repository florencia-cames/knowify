import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservationComponent } from './reservation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { RegionInfoComponent } from '../../region-info/region-info.component';
import { PersonalInformationComponent } from '../reservation-form-steps/personal-information/personal-information.component';
import { ReservationDetailComponent } from '../reservation-form-steps/details/details.component';
import { DateTimeComponent } from '../reservation-form-steps/date-time/date-time.component';
import { RegionComponent } from '../reservation-form-steps/region/region.component';
import { ReservationService } from '../reservation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

interface MockReservationService {
  notifyStepChange: jest.Mock;
}

interface MockMatSnackBar {
  open: jest.Mock;
}

describe('ReservationComponent', () => {
  let component: ReservationComponent;
  let fixture: ComponentFixture<ReservationComponent>;
  let mockReservationService: MockReservationService;
  let mockSnackBar: MockMatSnackBar;

  beforeEach(async () => {
    mockReservationService = {
      notifyStepChange: jest.fn()
    };

    mockSnackBar = {
      open: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatStepperModule,
        ReservationComponent,
        RegionInfoComponent,
        PersonalInformationComponent,
        ReservationDetailComponent,
        DateTimeComponent,
        RegionComponent
      ],
      providers: [
        { provide: ReservationService, useValue: mockReservationService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              availableDates: [],
              availableSlots: [],
              region: [],
              reservation: null,
              step: 0
            })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form groups correctly', () => {
    expect(component.personalFormGroup).toBeTruthy();
    expect(component.detailsFormGroup).toBeTruthy();
    expect(component.datetimeFormGroup).toBeTruthy();
    expect(component.regionFormGroup).toBeTruthy();
  });

});
