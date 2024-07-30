import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CancelConfirmationDialogComponent } from './cancel-confirmation-dialog.component.ts/cancel-confirmation-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Dialogservice {
  constructor(public dialog: MatDialog) {}

  /**
   * Open cancel dialog
   * @param title 
   * @returns an observable with a boolean valie
   */
  openCancelDialog(title: string): Observable<boolean> {
    const dialogRef = this.dialog.open(CancelConfirmationDialogComponent, {
      data: {
        title,
      },
    });
    return dialogRef.afterClosed();
  }
}
