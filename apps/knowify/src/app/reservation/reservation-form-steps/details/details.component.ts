import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';

@Component({
  standalone: true,
  imports: [SharedModule, CommonModule],
  selector: 'reservation-details',
  templateUrl: './detail.component.html',
})
export class ReservationDetailComponent implements OnInit{
  @Output() formValue = new EventEmitter<any>();
  @Output() back = new EventEmitter<number>();
  @Input() detailsFormGroup!: FormGroup;

  constructor(@Optional() @Inject(MatStepper) private stepper: MatStepper) {}

  submit() {
    this.formValue.emit(this.detailsFormGroup?.value);
  }

  backButton(){
    this.stepper.previous();
  }

  ngOnInit(): void {
    this.detailsFormGroup.valueChanges.subscribe(() => {
      this.validateChildrenCount();
    });
  }
  validateChildrenCount(): void {
    const partySizeControl = this.detailsFormGroup.get('partySize');
    const childrenCountControl = this.detailsFormGroup.get('childrenCount');

    if (partySizeControl && childrenCountControl) {
      const partySize = partySizeControl.value;
      const childrenCount = childrenCountControl.value;

      const existingErrors = childrenCountControl.errors || {};
      if (childrenCount > partySize) {
        childrenCountControl.setErrors({ 'childrenCountInvalid': true });
      } else {
        const { 'childrenCountInvalid': removedError, ...restErrors } = existingErrors;
        childrenCountControl.setErrors(Object.keys(restErrors).length > 0 ? restErrors : null);
      }
    }
  }

  goToNextStep() {
    if (this.stepper && ((this.stepper.linear && this.detailsFormGroup.valid) ||  !this.stepper.linear )) {
      this.stepper.next();
    }
  }
}
