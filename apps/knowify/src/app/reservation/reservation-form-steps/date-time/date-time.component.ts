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

@Component({
  standalone: true,
  imports: [SharedModule, CommonModule],
  selector: 'datetime',
  templateUrl: './date-time.component.html',
})
export class DateTimeComponent {
  @Output() formValue = new EventEmitter<any>();
  @Output() back = new EventEmitter<number>();
  @Input() datetimeFormGroup!: FormGroup;
  editFormMode = true;
  initialized = false;
  @Input() public availableDates: Date[] = [];
  @Input() public availableSlots: string[] = [];
  constructor(@Optional() @Inject(MatStepper) private stepper: MatStepper) {}

  backButton() {
    this.stepper.previous();
  }
  goToNextStep() {
    if (
      this.stepper &&
      (this.stepper.linear &&
        this.datetimeFormGroup.valid ||
        !this.stepper.linear)
    ) {
      this.stepper.next();
    }
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    return this.availableDates.some((availableDate) => {
      return availableDate.toDateString() === date.toDateString();
    });
  };
}
