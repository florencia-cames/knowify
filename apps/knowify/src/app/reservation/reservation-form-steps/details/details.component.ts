import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
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
  selector: 'reservation-details',
  templateUrl: './detail.component.html',
})
export class ReservationDetailComponent {
  @Input() detailsFormGroup!: FormGroup;

  constructor(@Optional() @Inject(MatStepper) private stepper: MatStepper) {}
  
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
