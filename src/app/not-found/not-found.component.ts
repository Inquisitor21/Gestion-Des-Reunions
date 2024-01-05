import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {
    userReponse: string = '';
    montrerErreurMessage: boolean = false;
    selectedLanguage: string = 'fr';

    devinettes: { question: string, reponse: string[] }[] = [
        {
            question: this.translate.instant("devinette_1"),
            reponse: ["angular"]
        },
        {
            question: this.translate.instant("devinette_2"),
            reponse: ["typescript"]
        },
        {
            question: this.translate.instant("devinette_3"),
            reponse: ["didier"]
        }
    ];

    devinetteEnCours: { question: string, reponse: string[] } = this.getRandomDevinette();

    constructor(private router: Router, private translate: TranslateService) {}

    verifierReponse() {
        const userReponseLower = this.userReponse.toLowerCase();
        if (this.devinetteEnCours.reponse.includes(userReponseLower)) {
            this.router.navigate(['/']);
        } else {
            this.montrerErreurMessage = true;
            this.devinetteEnCours = this.getRandomDevinette();
        }
    }

    getRandomDevinette() {
        return this.devinettes[Math.floor(Math.random() * this.devinettes.length)];
    }
}
