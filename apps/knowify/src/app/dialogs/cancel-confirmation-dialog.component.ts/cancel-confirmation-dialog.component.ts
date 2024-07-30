import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-cancel-confirmation-dialog',
  templateUrl: './cancel-confirmation-dialog.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class CancelConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CancelConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }
  ) {}
}
