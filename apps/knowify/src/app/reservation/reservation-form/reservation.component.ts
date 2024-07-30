import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { SharedModule } from '../../shared/shared.module';
import { FadeAnimationDirective } from '../../directives/fade-animation-direcitve';
import { RegionInfoComponent } from '../../region-info/region-info.component';
import { PersonalInformationComponent } from '../reservation-form-steps/personal-information/personal-information.component';
import { ReservationDetailComponent } from '../reservation-form-steps/details/details.component';
import { DateTimeComponent } from '../reservation-form-steps/date-time/date-time.component';
import { RegionComponent } from '../reservation-form-steps/region/region.component';
import { Region, Reservation, ReservationStatus } from '../reservation.interfaces';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ReservationService } from '../reservation.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    FadeAnimationDirective,
    RegionInfoComponent,
    PersonalInformationComponent,
    MatStepperModule,
    ReservationDetailComponent,
    DateTimeComponent,
    RegionComponent,
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css',
})
export class ReservationComponent implements OnInit, AfterViewInit {
  @ViewChild(MatStepper) stepper!: MatStepper;

  public stepperVisible: boolean = false;
  public mainFormGroup: FormGroup;
  public selectedIndex: number = 0;
  public availableDates: Date[] = [];
  public availableSlots: string[] = [];
  public region: Region[] = [];
  private reservation!: Reservation;

  constructor(
    private fb: FormBuilder,
    private _reservationService: ReservationService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.mainFormGroup = this.fb.group({
      personal: this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern(/^\d{10}$/)],
        ],
      }),
      details: this.fb.group({
        partySize: [
          null,
          [Validators.required, Validators.min(1), Validators.max(12)],
        ],
        childrenCount: [0, [Validators.min(0)]],
        smoking: [false],
        birthday: [false],
        birthdayName: [''],
      }),
      datetime: this.fb.group({
        date: [null, Validators.required],
        time: [null, Validators.required],
      }),
      region: this.fb.group({
        region: [null, Validators.required],
      }),
    });
    this.mainFormGroup.get('details')?.valueChanges.subscribe(() => {
      this.mainFormGroup.get('region')?.get('region')?.setValue(null);
    });
  }


  ngOnInit(): void {
    this.route.data.subscribe(({ data }) => {
      this.availableDates = data.availableDates;
      this.availableSlots = data.availableSlots;
      this.region = data.region;
      if (data && data.reservation) {
        if (data.reservation.status !== ReservationStatus.CONFIRMED) {
          this.stepperVisible = true;
          this.personalFormGroup.patchValue(data.reservation);
          this.detailsFormGroup.patchValue(data.reservation);
          this.datetimeFormGroup.get('time')?.setValue(data.reservation.time);
          this.datetimeFormGroup
            .get('date')
            ?.setValue(new Date(data.reservation.date));
          this.regionFormGroup
            .get('region')
            ?.setValue(+data.reservation.region);
          this.selectedIndex = +data.step;
          this.mainFormGroup.updateValueAndValidity();
          this.reservation = data.reservation;
          
        } else {

          this._snackBar.open(
            'confirmación ya hecha, no se puede editar',
            'ok'
          );
        }
      }
    });
    
  }

  ngAfterViewInit(): void {
    if (this.stepper && this.selectedIndex) {
      this.stepper.selectedIndex = this.selectedIndex;
    }
  }

/**
   * Retrieves the current reservation object.
   * 
   * @returns {Reservation} The reservation object.
   */
  public getReservation(): Reservation {
    return this.reservation;
  }
  
/**
 * Gets the form group for personal information.
 * 
 * @returns {FormGroup} The personal form group.
 */
public get personalFormGroup(): FormGroup {
  return this.mainFormGroup.get('personal') as FormGroup;
}

/**
 * Gets the form group for region details.
 * 
 * @returns {FormGroup} The region form group.
 */
public get regionFormGroup(): FormGroup {
  return this.mainFormGroup.get('region') as FormGroup;
}

/**
 * Gets the form group for reservation details.
 * 
 * @returns {FormGroup} The details form group.
 */
public get detailsFormGroup(): FormGroup {
  return this.mainFormGroup.get('details') as FormGroup;
}

/**
 * Gets the form group for date and time information.
 * 
 * @returns {FormGroup} The datetime form group.
 */
public get datetimeFormGroup(): FormGroup {
  return this.mainFormGroup.get('datetime') as FormGroup;
}

/**
 * Handles changes in the stepper and notifies the reservation service.
 * 
 * @param {StepperSelectionEvent} event - The stepper selection event.
 * @returns {void}
 */
public onStepChange(event: StepperSelectionEvent): void {
  if (event.selectedIndex === 3) {
    const reservation = {
      ...this.reservation,
      ...this.personalFormGroup.value,
      ...this.detailsFormGroup.value,
      ...this.datetimeFormGroup.value,
    };
    this._reservationService.notifyStepChange(reservation);
  }
}

}
