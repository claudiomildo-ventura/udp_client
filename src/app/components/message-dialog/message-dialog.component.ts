import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';

import {MessageDialogInformation} from "../../shared/interface/MessageDialogInformation";

@Component({
    selector: 'app-message-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    templateUrl: './message-dialog.component.html',
    styleUrl: './message-dialog.component.css'
})
export class MessageDialogComponent {
    constructor(
        private dialogRef: MatDialogRef<MessageDialogComponent, { confirmed: boolean }>,
        @Inject(MAT_DIALOG_DATA) public data: MessageDialogInformation
    ) {
    }

    public onConfirm(): void {
        this.dialogRef.close();
    }
}