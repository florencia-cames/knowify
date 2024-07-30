import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, MatProgressSpinnerModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'knowify';
  public loading$: Observable<boolean>;
  public isMenuOpen = false;

  constructor(private readonly loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }

  /**
   * Toggles the state of the menu between open and closed.
   *
   * This method updates the `isMenuOpen` property:
   * - If `isMenuOpen` is `false`, it sets it to `true`, opening the menu.
   * - If `isMenuOpen` is `true`, it sets it to `false`, closing the menu.
   *
   * @returns {void} This method does not return any value.
   */
  public toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
