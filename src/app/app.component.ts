import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'TP2';

    //Ici les methodes pour le changement de langue sont configurées pour sauver la langue dans sessionStorage.
    //Si utilisateur ferme le navigateur et revient sur le site, la langue se reset à FR.
    //Si utilisateur rafraichit la page, la langue sera toujours celle sélectionnée.
    constructor(private translate: TranslateService) {
        // Lire la langue stockée dans le session storage
        const langueSauvegardee = sessionStorage.getItem('selectedLanguage');
        if (langueSauvegardee) {
            this.selectedLanguage = langueSauvegardee;
        } else {
            // S'il n'y a pas de langue stockée, définir la langue par défaut
            this.selectedLanguage = 'fr';
            sessionStorage.setItem('selectedLanguage', this.selectedLanguage); // Enregistrer la langue par défaut dans le session storage
        }

        // Configurer la langue actuelle
        translate.setDefaultLang(this.selectedLanguage);
        translate.use(this.selectedLanguage); // Changer la langue globalement
    }

    onLanguageChange(langue: string) {
        this.selectedLanguage = langue;
        this.translate.use(langue); // Changer la langue globalement

        // Enregistrer la langue sélectionnée dans le session storage
        sessionStorage.setItem('selectedLanguage', langue);
    }

    selectedLanguage = 'fr';
}
