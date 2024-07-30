import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Region, Reservation } from '../reservation.interfaces';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CancelButtonDirective } from '../../directives/cancel-button-directive';

@Component({
  selector: 'app-reservation-resume',
  templateUrl: './confirmation.component.html',
  standalone: true,
  imports: [CommonModule, MatButtonModule, CancelButtonDirective],
  styleUrl: './confirmation.component.scss',
})
export class ConfirmationComponent implements OnInit {
  public reservation: Reservation | null = null;
  public isLoading = false;
  public region!: Region;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.route.data.subscribe(({ data }) => {
      this.isLoading = false;
      if (data.reservation) {
        this.reservation = data.reservation;
        this.region = data.region;
      } else {
        this.router.navigate(['/reservations']);
      }
    });
  }
}
