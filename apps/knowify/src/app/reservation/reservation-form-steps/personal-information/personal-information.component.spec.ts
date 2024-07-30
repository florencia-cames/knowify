import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { PersonalInformationComponent } from './personal-information.component';
import { By } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PersonalInformationComponent', () => {
  let component: PersonalInformationComponent;
  let fixture: ComponentFixture<PersonalInformationComponent>;
  let formBuilder: FormBuilder;
  let stepper: MatStepper;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        PersonalInformationComponent,
        BrowserAnimationsModule,
      ],
      providers: [{ provide: MatStepper, useValue: { next: jest.fn() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalInformationComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    stepper = TestBed.inject(MatStepper);

    component.formGroup = formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display validation errors for required fields', () => {
    component.formGroup.controls['name'].setValue('');
    component.formGroup.controls['email'].setValue('');
    component.formGroup.controls['phoneNumber'].setValue('');
    component.formGroup.markAllAsTouched();

    fixture.detectChanges();

    const nameError = fixture.debugElement.query(
      By.css('mat-form-field:nth-of-type(1) mat-error')
    ).nativeElement;
    const emailError = fixture.debugElement.query(
      By.css('mat-form-field:nth-of-type(2) mat-error')
    ).nativeElement;
    const phoneNumberError = fixture.debugElement.query(
      By.css('mat-form-field:nth-of-type(3) mat-error')
    ).nativeElement;

    expect(nameError.textContent).toContain('Name is required.');
    expect(emailError.textContent).toContain('Email is required.');
    expect(phoneNumberError.textContent).toContain('Phone number is required.');
  });

  it('should enable Next button only if form is valid', () => {
    component.formGroup.controls['name'].setValue('John Doe');
    component.formGroup.controls['email'].setValue('john.doe@example.com');
    component.formGroup.controls['phoneNumber'].setValue('1234567890');
    fixture.detectChanges();
    const nextButton = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;
    expect(nextButton.disabled).toBeFalsy();
  });

  it('should call goToNextStep when Next button is clicked', () => {
    // Arrange
    const goToNextStepSpy = jest.spyOn(component, 'goToNextStep');
    component.formGroup.controls['name'].setValue('John Doe');
    component.formGroup.controls['email'].setValue('john.doe@example.com');
    component.formGroup.controls['phoneNumber'].setValue('1234567890');
    fixture.detectChanges();
    const nextButton = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;
    nextButton.click();
    expect(goToNextStepSpy).toHaveBeenCalled();
  });

  it('should emit formValue event with form data', () => {
    const formValueSpy = jest.spyOn(component.formValue, 'emit');
    component.formGroup.controls['name'].setValue('John Doe');
    component.formGroup.controls['email'].setValue('john.doe@example.com');
    component.formGroup.controls['phoneNumber'].setValue('1234567890');
    component.submit();
    expect(formValueSpy).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
    });
  });
});
