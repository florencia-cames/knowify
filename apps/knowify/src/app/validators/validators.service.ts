import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidatorsService {
        

  /**
   * Creates a validator function to ensure childrenCount does not exceed partySize.
   *
   * @param partySizeControlName - The name of the control for party size.
   * @returns A validator function that checks the validity of childrenCount.
   */
  public childrenCountValidator(partySizeControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const formGroup = control.parent;

      if (!formGroup) {
        return null;
      }

      const partySizeControl = formGroup.get(partySizeControlName);
      if (!partySizeControl) {
        return null;
      }

      const partySize = partySizeControl.value;
      const childrenCount = control.value;

      if (childrenCount > partySize) {
        return { childrenCountInvalid: true };
      }

      return null;
    };
  }

}
