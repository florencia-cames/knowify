import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { BackButtonDirective } from '../../../directives/back-button.directive';

@Component({
  standalone: true,
  imports: [SharedModule, CommonModule, BackButtonDirective],
  selector: 'reservation-details',
  templateUrl: './detail.component.html',
})
export class ReservationDetailComponent implements OnInit {
  @Output() formValue = new EventEmitter<any>();
  @Input() detailsFormGroup!: FormGroup;

  constructor(@Optional() @Inject(MatStepper) private stepper: MatStepper) {}

  ngOnInit(): void {
    this.detailsFormGroup.valueChanges.subscribe(() => {
      this.validateChildrenCount();
    });
  }

  

  /**
   * Validates that the number of children does not exceed the party size.
   *
   * @returns {void}
   */
  validateChildrenCount(): void {
    const partySizeControl = this.detailsFormGroup.get('partySize');
    const childrenCountControl = this.detailsFormGroup.get('childrenCount');

    if (partySizeControl && childrenCountControl) {
      const partySize = partySizeControl.value;
      const childrenCount = childrenCountControl.value;

      const existingErrors = childrenCountControl.errors || {};
      if (childrenCount > partySize) {
        childrenCountControl.setErrors({ childrenCountInvalid: true });
      } else {
        const { childrenCountInvalid: removedError, ...restErrors } =
          existingErrors;
        childrenCountControl.setErrors(
          Object.keys(restErrors).length > 0 ? restErrors : null
        );
      }
    }
  }

  /**
   * Advances to the next step in the stepper if the current step is valid.
   *
   * @returns {void}
   */
  goToNextStep() {
    if (
      this.stepper &&
      ((this.stepper.linear && this.detailsFormGroup.valid) ||
        !this.stepper.linear)
    ) {
      this.stepper.next();
    }
  }
}
