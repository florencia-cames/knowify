import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Optional,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';

@Component({
  standalone: true,
  imports: [SharedModule, CommonModule],
  selector: 'personal-information',
  templateUrl: './personal-information.component.html',
})
export class PersonalInformationComponent {
  @Output() formValue = new EventEmitter<any>();
  @Input() formGroup!: FormGroup;

  constructor(@Optional() @Inject(MatStepper) private stepper: MatStepper) {}

  submit() {
    if (this.formGroup) {
      this.formValue.emit(this.formGroup.value);
    }
  }

  goToNextStep() {
    if (
      this.stepper &&
      (this.stepper.linear && this.formGroup.valid || !this.stepper.linear)
    ) {
      this.stepper.next();
    }
  }
}
