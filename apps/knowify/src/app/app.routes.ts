import { Route } from '@angular/router';
import { ReservationResolver } from './reservation/reservation-resolver';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'reservations',
    pathMatch: 'full',
  },
  {
    path: 'reservations',
    loadComponent: () =>
      import('./reservation/reservation-form/reservation.component').then(
        (m) => m.ReservationComponent
      ),
    resolve: { data: ReservationResolver },
  },
  {
    path: 'reservations/:id/:step',
    loadComponent: () =>
      import('./reservation/reservation-form/reservation.component').then(
        (m) => m.ReservationComponent
      ),
    resolve: { data: ReservationResolver },
  },
  {
    path: 'reservation/:id',
    loadComponent: () =>
      import(
        './reservation/reservation-detail/reservation-detail.component'
      ).then((m) => m.ReservationResumeComponent),
    resolve: { data: ReservationResolver },
  },
  {
    path: 'confirmation-page/:id',
    loadComponent: () =>
      import('./reservation/confirmation/confirmation.component').then(
        (m) => m.ConfirmationComponent
      ),
    resolve: { data: ReservationResolver },
  },
  {
    path: '**',
    redirectTo: 'reservations',
  },
];
