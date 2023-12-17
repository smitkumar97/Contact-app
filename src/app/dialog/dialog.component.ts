import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  closeButton = false;
  icon = '';
  primaryMessage!: string;
  secondaryMessage!: string;
  primaryButton = 'Yes';
  secondaryButton = 'No';
  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.closeButton = data.closeButton;
    this.icon = data.icon;
    this.primaryMessage = data.primaryMessage;
    this.secondaryMessage = data.secondaryMessage;
    this.primaryButton = data.primaryButton;
    this.secondaryButton = data.secondaryButton;
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
