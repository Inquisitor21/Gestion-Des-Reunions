import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-popup-messages',
    template: `
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ 'popup_H5' | translate }}</h5>
            </div>
            <div class="modal-body">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>{{ 'popup_Prenom' | translate }}</th>
                                <th>{{ 'popup_Nom' | translate }}</th>
                                <th>{{ 'popup_Email' | translate }}</th>
                                <th>{{ 'popup_Telephone' | translate }}</th>
                                <th>{{ 'popup_Message' | translate }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let message of data.messages">
                                <td>{{ message.prenom }}</td>
                                <td>{{ message.nom }}</td>
                                <td>{{ message.email }}</td>
                                <td>{{ message.telephone }}</td>
                                <td>{{ message.message }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .modal-content {
                background-color: #fff;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
            }

            .modal-header {
                background-color: red;
                padding: 10px;
            }

            .modal-title {
                font-weight: bold;
                color: white;
                font-size: 1rem;
                margin-bottom: 1rem;
            }

            .modal-body {
                padding: 20px;
            }

            .table {
                width: 100%;
                margin-bottom: 1rem;
                background-color: transparent;
            }

            .table th,
            .table td {
                padding: 0.75rem;
                vertical-align: top;
                border-top: 1px solid #dee2e6;
            }

            .table thead th {
                vertical-align: bottom;
                border-bottom: 2px solid #dee2e6;
            }
        `,
    ],
})
export class PopupMessagesComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
