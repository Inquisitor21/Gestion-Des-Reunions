import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-reunions',
    templateUrl: './reunions.component.html',
    styleUrls: ['./reunions.component.css']
})
export class ReunionsComponent implements OnInit {
    showModal = false;
    reunion_id: string = '';
    id: number = 1;
    username: string = '';
    constructor(private http: HttpClient, private datePipe: DatePipe, private translate: TranslateService) { }

    selectedLanguage: string = 'fr';
    dataSource: {
        createur_username: string;
        id: number;
        createur_nom: string;
        createur_prenom: string;
        createur_email: string;
        reunion_id: string;
        participants: [
            {
                nom: string,
                prenom: string,
                disponnible: string
            }
        ];
        date_debut: string;
        date_fin: string;
        description: string;
    }[] = [];

    ngOnInit() {
        this.username = sessionStorage.getItem('username') || '';
        this.getReunions().subscribe({
            next: (response: any[]) => {
                this.dataSource = response.map((reunion: any) => {
                    return {
                        id: this.id++,
                        createur_nom: reunion.createur_nom,
                        createur_prenom: reunion.createur_prenom,
                        createur_email: reunion.createur_email,
                        reunion_id: reunion.reunion_id,
                        participants: reunion.participants.map((participant: { nom: string; prenom: string; disponnible: string }) => `${participant.nom} ${participant.prenom}<br>${participant.disponnible}`).join('<br><br>'),
                        date_debut: reunion.date_debut,
                        date_fin: reunion.date_fin,
                        description: reunion.description,
                        createur_username: reunion.createur_prenom
                    };
                });
            },
            error: (error: any) => {
                console.error(error);
            }
        });
    }

    getReunions(): Observable<any> {
        return this.http.get(`https://us-central1-tp3-vazgen-markaryan.cloudfunctions.net/reunion`);
    }

    deleteReunion(reunion_id: string) {
        this.translate.get('confirmation_suppression').subscribe((translatedText: string) => {
            if (confirm(translatedText)) {
                const url = `https://us-central1-tp3-vazgen-markaryan.cloudfunctions.net/reunion?id=${reunion_id}`;
                this.http.delete(url).subscribe({
                    next: (response: any) => {
                        console.log(response);
                        this.ngOnInit();
                    },
                    error: (error: any) => {
                        console.log(error);
                    }
                });
            }
        });
    }

    isUserConnected(row: { createur_prenom: string }): boolean {
        return this.username !== '' && this.username === row.createur_prenom;
    }
}
