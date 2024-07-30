import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../reservation.service';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Reservation, ReservationStatus } from '../reservation.interfaces';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateService } from '../../services/dates.services';
import { CancelButtonDirective } from '../../directives/cancel-button-directive';
import {MatCardModule} from '@angular/material/card';

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
    MatCardModule
  ],
})
export class ReservationResumeComponent implements OnInit {
  reservation: Reservation | null = null;
  region: any;

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private _dateService: DateService
  ) {}

  editField(step: number) {
    this.router.navigate(['reservations', this.reservation?.hashId, step])
  }

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

  public get reservationIsPending(): boolean{
    return this.reservation?.status !== ReservationStatus.CONFIRMED;
  }

  confirmReservation(): void {
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
