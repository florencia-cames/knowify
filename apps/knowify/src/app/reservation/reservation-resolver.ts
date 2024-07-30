import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Region, Reservation } from "./reservation.interfaces";
import { ReservationService } from "./reservation.service";
import { catchError, combineLatest, map, Observable, of, switchMap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReservationResolver implements Resolve<{
  reservation: Reservation | null,
  region: Region | null,
  availableDates: Date[],
  availableSlots: string[],
  step: string | null,
}> {
  constructor(private reservationService: ReservationService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{
    reservation: Reservation | null,
    region: Region | null,
    availableDates: Date[],
    availableSlots: string[],
    step: string | null,
  }> {
    const reservationId = route.paramMap.get('id');
    const step = route.paramMap.get('step');
    const regions$ = this.reservationService.getRegions();
    const dates$ = this.reservationService.getAvailableDates();
    const availableSlots$ = this.reservationService.getTimes();

    const reservation$ = reservationId 
      ? this.reservationService.getReservationById(reservationId).pipe(
          catchError(() => of(null))  
        )
      : of(null);

    return combineLatest([
      reservation$,
      regions$,
      dates$,
      availableSlots$
    ]).pipe(
      map(([reservation, regions, dates, slots]) => ({
        reservation,  // Now directly the reservation object or null
        region: regions.length > 0 ? regions[0] : null,  // Adjust according to your requirements
        availableDates: dates ?? [],
        availableSlots: slots ?? [],
        step
      })),
      catchError(() => of({
        reservation: null,
        region: null,
        availableDates: [],
        availableSlots: [],
        step: null
      }))
    );
  }
}
