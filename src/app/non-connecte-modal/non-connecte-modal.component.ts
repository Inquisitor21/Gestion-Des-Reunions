// non-connecte-modal.component.ts
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-non-connecte-modal',
    templateUrl: './non-connecte-modal.component.html'
})
export class NonConnecteModalComponent {
    constructor(public dialogRef: MatDialogRef<NonConnecteModalComponent>) {}

    close(): void {
        this.dialogRef.close();
    }
}
