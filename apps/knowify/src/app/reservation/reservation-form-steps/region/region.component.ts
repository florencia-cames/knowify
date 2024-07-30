import { Component, Inject, Input, OnDestroy, Optional } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MatStepper } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import {
  Region,
  Reservation,
  SuggestionResponse,
} from '../../reservation.interfaces';
import { ReservationService } from '../../reservation.service';
import { catchError, filter, map, of, Subscription, switchMap } from 'rxjs';
import { RegionInfoComponent } from '../../../region-info/region-info.component';
import { DateService } from '../../../services/dates.services';
import { Router } from '@angular/router';
import { SuggestionFormComponent } from '../../suggestion-form/suggestion-form.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  imports: [
    SharedModule,
    CommonModule,
    RegionInfoComponent,
    SuggestionFormComponent,
    MatSelectModule,
  ],
  selector: 'region',
  templateUrl: './region.component.html',
})
export class RegionComponent implements OnDestroy {
  @Input() regionFormGroup!: FormGroup;
  @Input() regions!: Region[];
  private dateSubscription: Subscription = new Subscription();
  public availableRegions: Region[] = [];
  public reservation!: Reservation;
  public alternativeDates: SuggestionResponse[] = [];

  constructor(
    @Optional() @Inject(MatStepper) private stepper: MatStepper,
    private _reservationService: ReservationService,
    private _dateService: DateService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this._reservationService.stepChange$
      .pipe(
        filter((data: Reservation | null) => data !== null),
        switchMap((data: Reservation) => {
          return this._reservationService.getRegions().pipe(
            map((regions) => {
              console.log(this.reservation);
              this.reservation = data;
              if (!data) return regions;
              return regions.filter((region) => {
                const hasEnoughSeats =
                  region.seatingCapacity >= (data.partySize || 0);
                const allowsChildren =
                  !data.childrenCount || region.childrenAllowed;
                const allowsSmoking = !data.smoking || region.smokingAllowed;
                return hasEnoughSeats && allowsChildren && allowsSmoking;
              });
            })
          );
        })
      )
      .subscribe((availableRegions: Region[]) => {
        this.availableRegions = availableRegions;
        this.alternativeDates = [];
        if (this.availableRegions.length === 0) {
          this._snackBar.open(
            'No regions available for the selected criteria.',
            'Close',
            {
              duration: 5000,
            }
          );
        }
      });
  }

  ngOnDestroy(): void {
    this.dateSubscription.unsubscribe();
  }

  /**
   * Navigates to the previous step in the stepper.
   *
   * @returns {void}
   */
  public backButton(): void {
    this.stepper.previous();
  }

  /**
   * Advances to the next step in the stepper if the form is valid or if linear validation is not enforced.
   *
   * @returns {void}
   */
  public goToNextStep(): void {
    if (
      this.stepper &&
      (this.stepper.linear ||
        this.regionFormGroup.valid ||
        !this.stepper.linear)
    ) {
      this.stepper.next();
    }
  }

  /**
   * Updates reservation with the selected date and region from the suggestion, then checks availability.
   *
   * @param {SuggestionResponse} event - The suggested date and region.
   * @returns {void}
   */
  public checkAvaibilitySuggestion(event: SuggestionResponse): void {
    this.reservation.date = event.date;
    this.reservation.region = event.region.id;
    this.regionFormGroup.get('region')?.setValue(event.region.id);
    this.checkAvaibility();
  }

  /**
   * Checks reservation availability. Updates or creates reservation if available; suggests alternative dates if not.
   *
   * @returns {void}
   */
  public checkAvaibility(): void {
    this.alternativeDates = [];
    if (this.reservation) {
      const { date, email } = this.reservation;
      const { region } = this.regionFormGroup.value;
      const formattedDate = this._dateService.formatDateToYYYYMMDD(
        new Date(date)
      );
      this.reservation.date = formattedDate;
      this._reservationService
        .checkAvailability(formattedDate, region, email)
        .pipe(
          switchMap((isAvailable: boolean) => {
            if (isAvailable) {
              const reservationData = this.reservation;
              if (this.reservation.hashId) {
                return this._reservationService.updateReservation(
                  this.reservation.hashId,
                  { ...reservationData, region }
                );
              } else {
                return this._reservationService.createReservation({
                  ...reservationData,
                  region,
                });
              }
            } else {
              const reservationData = this.reservation;
              return this._reservationService
                .suggestAlternativeDates({ ...reservationData, region })
                .pipe(
                  switchMap((alternativeDates: SuggestionResponse[]) => {
                    this.alternativeDates = alternativeDates;
                    return of(null);
                  }),
                  catchError(() => {
                    return of(null);
                  })
                );
            }
          }),
          catchError((error) => {
            return of(null);
          })
        )
        .subscribe((data) => {
          if (data && data.id) {
            this.router.navigate(['/reservation', data.hashId]);
          }
        });
    }
  }
}
