import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuggestionFormComponent } from './suggestion-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import { Region, SuggestionResponse } from '../reservation.interfaces';

describe('SuggestionFormComponent', () => {
  let component: SuggestionFormComponent;
  let fixture: ComponentFixture<SuggestionFormComponent>;
  let mockResponseRegions: Region[] = [
    {
      id: 1,
      name: 'Main Hall',
      seatingCapacity: 12,
      childrenAllowed: true,
      smokingAllowed: false,
    },
    {
      id: 2,
      name: 'Bar',
      seatingCapacity: 4,
      childrenAllowed: false,
      smokingAllowed: false,
    },
    {
      id: 3,
      name: 'Riverside',
      seatingCapacity: 8,
      childrenAllowed: true,
      smokingAllowed: false,
    },
    {
      id: 4,
      name: 'Riverside (smoking allowed)',
      seatingCapacity: 6,
      childrenAllowed: false,
      smokingAllowed: true,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatRadioModule,
        MatButtonModule,
        SuggestionFormComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display form when suggestedDates has items', () => {
    const suggestedDates: SuggestionResponse[] = [
      { date: '2024-07-01', region: mockResponseRegions[0] },
      { date: '2024-07-02', region: mockResponseRegions[1] },
    ];
    component.suggestedDates = suggestedDates;
    fixture.detectChanges();
    const formElement = fixture.debugElement.query(By.css('form'));
    expect(formElement).toBeTruthy();
  });

  it('should not display form when suggestedDates is empty', () => {
    component.suggestedDates = [];
    fixture.detectChanges();
    const formElement = fixture.debugElement.query(By.css('form'));
    expect(formElement).toBeNull();
  });

  it('should emit dateSelected event with selected date when form is valid', () => {
    const suggestedDates: SuggestionResponse[] = [
      { date: '2024-07-01', region: mockResponseRegions[0] },
      { date: '2024-07-02', region: mockResponseRegions[1] },
    ];
    component.suggestedDates = suggestedDates;
    fixture.detectChanges();
    component.suggestedForm.controls['selectedDate'].setValue(
      suggestedDates[0]
    );
    jest.spyOn(component.dateSelected, 'emit');
    component.onSubmit();
    expect(component.dateSelected.emit).toHaveBeenCalledWith(suggestedDates[0]);
  });

  it('should not emit dateSelected event when form is invalid', () => {
    component.suggestedDates = [];
    fixture.detectChanges();
    jest.spyOn(component.dateSelected, 'emit');
    component.onSubmit();
    expect(component.dateSelected.emit).not.toHaveBeenCalled();
  });

  it('should disable the submit button when form is invalid', () => {
    component.suggestedDates = [
      { date: '2024-07-01', region: mockResponseRegions[0] },
    ];
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    expect(submitButton.disabled).toBeTruthy();
    component.suggestedForm.controls['selectedDate'].setValue(
      component.suggestedDates[0]
    );
    fixture.detectChanges();
    expect(submitButton.disabled).toBeFalsy();
  });
});
