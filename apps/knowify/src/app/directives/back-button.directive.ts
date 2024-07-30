import { Directive, HostListener, Optional } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Directive({
  selector: '[appBackButton]',
  standalone: true
})
export class BackButtonDirective {

  constructor(@Optional() private stepper: MatStepper) {}

  @HostListener('click')
  onClick() {
    if (this.stepper) {
      this.stepper.previous();
    }
  }
}
