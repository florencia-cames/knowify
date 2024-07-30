import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import {
  Region,
  Reservation,
  ReservationStatus,
  SuggestionResponse,
} from './reservation.interfaces';
import { Dialogservice } from '../dialogs/dialogs.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private baseUrl = 'http://localhost:3000/api';
  private reservationStepChangeSubject =
    new BehaviorSubject<Reservation | null>(null);
  public stepChange$ = this.reservationStepChangeSubject.asObservable();
  constructor(
    private http: HttpClient,
    private _dialogService: Dialogservice,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  checkAvailability(
    date: string,
    region: number,
    email: string
  ): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.baseUrl}/reservations/availability?date=${date}&region=${region}&email=${email}`
    );
  }

  suggestAlternativeDates(
    reservationData: Partial<Reservation>
  ): Observable<SuggestionResponse[]> {
    return this.http.post<SuggestionResponse[]>(
      `${this.baseUrl}/reservations/suggest-alternatives`,
      reservationData
    );
  }

  createReservation(reservationData: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(
      `${this.baseUrl}/reservations`,
      reservationData
    );
  }

  notifyStepChange(partialReservation: Reservation): void {
    this.reservationStepChangeSubject.next(partialReservation);
  }

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseUrl}/reservations`);
  }

  getAvailableDates(): Observable<Date[]> {
    return this.http
      .get<string[]>(`${this.baseUrl}/availability/dates`)
      .pipe(map((dates) => dates.map((dateStr) => new Date(dateStr))));
  }

  getTimes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/availability/times`);
  }

  getSuggestions(
    date: string,
    partySize: number,
    smoking: boolean,
    childrenCount: number
  ): Observable<any> {
    let params = new HttpParams()
      .set('date', date)
      .set('partySize', partySize.toString())
      .set('smoking', smoking.toString())
      .set('childrenCount', childrenCount.toString());

    return this.http.get<any[]>(`${this.baseUrl}/availability/suggestions`, {
      params,
    });
  }

  getRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.baseUrl}/region`);
  }

  getReservationById(hashId: string): Observable<Reservation> {
    return this.http.get<Reservation>(
      `${this.baseUrl}/reservations/reservation/${hashId}`
    );
  }

  updateReservationStatus(
    hashId: string,
    status: ReservationStatus
  ): Observable<Reservation> {
    return this.http.patch<Reservation>(
      `${this.baseUrl}/reservations/reservation/${hashId}`,
      { status }
    );
  }

  updateReservation(
    hashId: string,
    reservation: Reservation
  ): Observable<Reservation> {
    return this.http.patch<Reservation>(
      `${this.baseUrl}/reservations/reservation/${hashId}`,
      reservation
    );
  }

  deleteReservation(hashId: string): Observable<void> {
    return this.http.patch<void>(
      `${this.baseUrl}/reservations/cancel/${hashId}`,
      { hashId }
    );
  }

  cancelReservation(hashId: string): void {
    this._dialogService
      .openCancelDialog('Are you sure you want to cancel the reservation?')
      .subscribe((confirmed) => {
        if (confirmed) {
          this.deleteReservation(hashId).subscribe(() => {
            this._snackBar.open('Reservation cancelled successfully', 'ok');
            this.router.navigate(['/reservations']);
          });
        }
      });
  }
}
