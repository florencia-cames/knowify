import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { SuggestionResponse } from '../reservation.interfaces';


@Component({
  selector: 'suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.scss'],
  standalone: true,
  imports: [CommonModule,  ReactiveFormsModule,
    MatFormFieldModule,
    MatRadioModule,
    MatButtonModule, MatInputModule]
})
export class SuggestionFormComponent {
  
  @Input() suggestedDates: SuggestionResponse[] = []; 
  @Output() dateSelected: EventEmitter<SuggestionResponse> = new EventEmitter();
  public suggestedForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.suggestedForm = this.fb.group({
      selectedDate: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.suggestedForm.valid) {
        const selectedDate = this.suggestedForm.value.selectedDate;
        this.dateSelected.emit(selectedDate);
    }
  }

}
