import { Directive, HostListener, Input } from '@angular/core';
import { ReservationService } from '../reservation/reservation.service';

@Directive({
  selector: '[appCancelButton]',
  standalone: true
})
export class CancelButtonDirective {
  @Input('appCancelButton') reservation: any; // Ajusta el tipo según tu modelo

  constructor(private readonly _reservationService: ReservationService) {}

  @HostListener('click')
  onClick() {
    if (this.reservation) {
      this._reservationService.cancelReservation(this.reservation.hashId);
    }
  }
}
