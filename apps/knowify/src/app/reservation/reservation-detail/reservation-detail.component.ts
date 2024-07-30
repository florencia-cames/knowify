import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../reservation.service';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  Region,
  Reservation,
  ReservationStatus,
} from '../reservation.interfaces';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateService } from '../../services/dates.services';
import { CancelButtonDirective } from '../../directives/cancel-button-directive';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-reservation-resume',
  templateUrl: './reservation-detail.component.html',
  styleUrl: './reservation-detail.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    CancelButtonDirective,
    MatCardModule,
  ],
})
export class ReservationResumeComponent implements OnInit {
  public reservation: Reservation | null = null;
  public region!: Region;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly reservationService: ReservationService,
    private readonly router: Router,
    private readonly _snackBar: MatSnackBar,
    private readonly _dateService: DateService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ data }) => {
      if (data.reservation) {
        this.reservation = data.reservation;
        this.region = data.region;
      } else {
        this.router.navigate(['/reservations']);
      }
    });
  }

  /**
   * Navigates to the reservation editing page for a specific step.
   *
   * @param {number} step - The step number to navigate to in the reservation editing process.
   * @returns {void}
   *
   * This method constructs a URL using the reservation's hash ID and the specified step number,
   * then navigates to that URL using the Angular Router.
   */
  public editField(step: number): void {
    this.router.navigate(['reservations', this.reservation?.hashId, step]);
  }

  /**
   * Checks if the reservation is pending confirmation.
   *
   * @returns {boolean} `true` if the reservation is not confirmed, `false` otherwise.
   */
  public get reservationIsPending(): boolean {
    return this.reservation?.status !== ReservationStatus.CONFIRMED;
  }

  /**
   * Confirms the reservation if available and updates its status.
   *
   * - Checks if the reservation is available on the given date and region.
   * - Shows a snackbar message if the reservation is no longer available.
   * - Updates the reservation status to confirmed if available.
   * - Navigates to the confirmation page if the reservation is confirmed.
   *
   * @returns {void}
   */
  public confirmReservation(): void {
    if (this.reservation) {
      const { date, region, email, hashId } = this.reservation;
      const formattedDate = this._dateService.formatDate(new Date(date));
      this.reservationService
        .checkAvailability(formattedDate, region, email)
        .pipe(
          tap((isAvailable: boolean) => {
            if (!isAvailable) {
              this._snackBar.open(
                'We are sorry to inform that the current availability has changed and the current region for that date is not longer available',
                'ok'
              );
            }
          }),
          switchMap((isAvailable: boolean) =>
            isAvailable
              ? this.reservationService
                  .updateReservationStatus(hashId, ReservationStatus.CONFIRMED)
                  .pipe(
                    tap(() =>
                      this.router.navigate(['/confirmation-page', hashId])
                    ),
                    catchError(() => {
                      return of(false);
                    })
                  )
              : of(false)
          )
        )
        .subscribe();
    }
  }
}
