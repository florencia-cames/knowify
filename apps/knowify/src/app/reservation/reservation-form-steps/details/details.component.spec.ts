import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { ReservationDetailComponent } from './details.component';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';

describe('ReservationDetailComponent', () => {
  let component: ReservationDetailComponent;
  let fixture: ComponentFixture<ReservationDetailComponent>;
  let formBuilder: FormBuilder;
  let stepper: MatStepper;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatStepperModule,
        SharedModule,
        CommonModule,
        ReservationDetailComponent,
        BrowserAnimationsModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: MatStepper,
          useValue: { next: jest.fn(), previous: jest.fn(), linear: true },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationDetailComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.detailsFormGroup = formBuilder.group({
      partySize: [
        1,
        [Validators.required, Validators.min(1), Validators.max(12)],
      ],
      childrenCount: [0, [Validators.min(0)]],
      smoking: [false],
      birthday: [false],
      birthdayName: [''],
    });

    fixture.detectChanges();
    stepper = TestBed.inject(MatStepper) as MatStepper;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should mark childrenCount as invalid if greater than partySize', () => {
    component.detailsFormGroup.patchValue({
      partySize: 2,
      childrenCount: 3,
    });
    fixture.detectChanges();
    component.validateChildrenCount();
    expect(
      component.detailsFormGroup
        .get('childrenCount')
        ?.hasError('childrenCountInvalid')
    ).toBeTruthy();
  });

  it('should emit form value when submit is called', () => {
    const formValue = {
      partySize: 4,
      childrenCount: 2,
      smoking: true,
      birthday: true,
      birthdayName: 'John',
    };
    component.detailsFormGroup.patchValue(formValue);
    const formValueSpy = jest.spyOn(component.formValue, 'emit');
    component.submit();
    expect(formValueSpy).toHaveBeenCalledWith(formValue);
  });

  it('should call stepper.next() when goToNextStep is called and form is valid', () => {
    const nextSpy = jest.spyOn(stepper, 'next');
    component.detailsFormGroup.patchValue({ partySize: 4, childrenCount: 2 });
    component.goToNextStep();
    expect(nextSpy).toHaveBeenCalled();
  });

  it('should call stepper.previous() when backButton is called', () => {
    const previousSpy = jest.spyOn(stepper, 'previous');
    component.backButton();
    expect(previousSpy).toHaveBeenCalled();
  });

  it('should not navigate if form is invalid in goToNextStep', () => {
    const nextSpy = jest.spyOn(stepper, 'next');
    component.detailsFormGroup.patchValue({ partySize: null });
    component.goToNextStep();
    expect(nextSpy).not.toHaveBeenCalled();
  });

  it('should validate form control errors correctly', () => {
    component.detailsFormGroup.patchValue({
      partySize: 0,
      childrenCount: -1,
    });
    component.detailsFormGroup.markAllAsTouched();
    fixture.detectChanges();
    component.validateChildrenCount();
    expect(
      component.detailsFormGroup.get('partySize')?.hasError('min')
    ).toBeTruthy();
    expect(
      component.detailsFormGroup.get('childrenCount')?.hasError('min')
    ).toBeTruthy();
  });
});
