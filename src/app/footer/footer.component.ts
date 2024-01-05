import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent {
    constructor(private translate: TranslateService) {
        translate.setDefaultLang('fr');
    }

    // ngModel pour lier le bouton radio à la langue sélectionnée
    selectedValue: string = sessionStorage.getItem('selectedLanguage') || 'fr';

    @Output() languageChange: EventEmitter<string> = new EventEmitter();

    changeLanguage(langue: string) {
        this.selectedValue = langue; // Mettre à jour la valeur sélectionnée
        this.languageChange.emit(langue);
        sessionStorage.setItem('selectedLanguage', langue); // Enregistrer la langue sélectionnée dans le sessionStorage
    }
}
