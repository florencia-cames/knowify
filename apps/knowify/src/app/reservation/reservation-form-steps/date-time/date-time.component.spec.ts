import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { DateTimeComponent } from './date-time.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DateTimeComponent', () => {
  let component: DateTimeComponent;
  let fixture: ComponentFixture<DateTimeComponent>;
  let stepper: MatStepper;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        DateTimeComponent,
        BrowserAnimationsModule,
        NoopAnimationsModule,
      ],
      providers: [ FormBuilder,  {
        provide: MatStepper,
        useValue: { next: jest.fn(), previous: jest.fn(), linear: true },
      }, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimeComponent);
    component = fixture.componentInstance;
    component.datetimeFormGroup = new FormBuilder().group({
      date: [null, Validators.required],
      time: [null, Validators.required]
    });
    component.availableDates = [new Date('2024-07-01')];
    component.availableSlots = ['08:00', '09:00', '10:00'];
    fixture.detectChanges();
    stepper = TestBed.inject(MatStepper) as MatStepper;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not navigate to next step if form is invalid', () => {
    const nextSpy = jest.spyOn(stepper, 'next');
    component.datetimeFormGroup.get('date')?.setValue(null); // Invalid form
    component.datetimeFormGroup.get('time')?.setValue(null); // Invalid form
    component.datetimeFormGroup.updateValueAndValidity();
    component.datetimeFormGroup.markAsTouched();
    component.goToNextStep();
    expect(nextSpy).not.toHaveBeenCalled();
  });

  it('should navigate to next step if form is valid', () => {
    const nextSpy = jest.spyOn(stepper, 'next');
    component.datetimeFormGroup.get('date')?.setValue(new Date('2024-07-01')); // Valid form
    component.datetimeFormGroup.get('time')?.setValue('08:00'); // Valid form
    component.goToNextStep();
    expect(nextSpy).toHaveBeenCalled();
  });


  it('should filter dates based on availableDates', () => {
    const date = new Date('2024-07-01');
    const isValid = component.dateFilter(date);
    expect(isValid).toBe(true);
  });

  it('should display required errors', () => {
    component.datetimeFormGroup.get('date')?.setValue(null);
    component.datetimeFormGroup.get('time')?.setValue(null);
    component.datetimeFormGroup.markAsUntouched();
    fixture.detectChanges();

    expect(component.datetimeFormGroup.get('date')?.hasError('required')).toBeTruthy();
    expect(component.datetimeFormGroup.get('time')?.hasError('required')).toBeTruthy();
  });
});
