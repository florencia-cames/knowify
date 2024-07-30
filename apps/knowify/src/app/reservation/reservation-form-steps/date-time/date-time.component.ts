import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Optional,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { BackButtonDirective } from '../../../directives/back-button.directive';

@Component({
  standalone: true,
  imports: [SharedModule, CommonModule, BackButtonDirective],
  selector: 'datetime',
  templateUrl: './date-time.component.html',
})
export class DateTimeComponent {
  @Input() datetimeFormGroup!: FormGroup;
  @Input() public availableDates: Date[] = [];
  @Input() public availableSlots: string[] = [];
  constructor(@Optional() @Inject(MatStepper) private stepper: MatStepper) {}

  /**
   * Advances to the next step in the stepper if the current step is valid.
   *
   * @returns {void}
   */
  public goToNextStep(): void {
    if (
      this.stepper &&
      ((this.stepper.linear && this.datetimeFormGroup.valid) ||
        !this.stepper.linear)
    ) {
      this.stepper.next();
    }
  }

  /**
   * Filters selectable dates based on available dates.
   *
   * @param {Date | null} date - The date to check.
   * @returns {boolean} Whether the date is available.
   */
  public dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    return this.availableDates.some((availableDate) => {
      return availableDate.toDateString() === date.toDateString();
    });
  };
}
