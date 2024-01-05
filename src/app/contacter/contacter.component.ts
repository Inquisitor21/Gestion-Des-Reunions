import {Component, Input} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {MessageService} from "./message.service";
import { MatDialog } from '@angular/material/dialog';
import { PopupMessagesComponent } from '../popup-messages/popup-messages.component';

@Component({
    selector: 'app-contacter',
    templateUrl: './contacter.component.html',
    styleUrls: ['./contacter.component.css'],
})
export class ContacterComponent {
    @Input() selectedLanguage = 'fr';

    constructor(private translate: TranslateService, private messageService: MessageService, public dialog: MatDialog) {
        translate.setDefaultLang(this.selectedLanguage);
    }

    contacter_Valeur_Nom: string = '';
    contacter_Valeur_Prenom: string = '';
    contacter_Valeur_Courriel: string = '';
    contacter_Valeur_Commentaire: string = '';
    contacter_Limite_Error_Message: string = '';
    contacter_Button_Envoyer: string = 'contacter_Envoyer';
    contacter_Valeur_DummyTelephone: string = "+1 (514) 123-4567";

    contacter_Is_Form_Valid: boolean = false;
    nom_load: boolean = false;
    prenom_load: boolean = false;
    courriel_load: boolean = false;
    commentaire_load: boolean = false;

    contacter_Nom_Valide!: boolean;
    contacter_Prenom_Valide!: boolean;
    contacter_Courriel_Valide!: boolean;
    contacter_Limite_Valide!: boolean;

    limiteCaracteres: number = 250;
    nombreCaracteres: number = 0;

    // @ts-ignore
    monToken: string = sessionStorage.getItem('authToken');
    // @ts-ignore
    username: string = sessionStorage.getItem('username');

    messages: any[] =[];

    capturer_Inputs() {
        if (this.contacter_Is_Form_Valid) {

            // Appeler le service pour envoyer le message
            this.messageService
                .sendMessage(
                    this.contacter_Valeur_Nom,
                    this.username,
                    this.contacter_Valeur_Courriel,
                    this.contacter_Valeur_DummyTelephone,
                    this.contacter_Valeur_Commentaire,
                    this.monToken
                )
                .subscribe({
                    next: (response) => {
                        console.log('Message envoyé avec succès:', response);
                        // Réinitialisation des champs
                        this.contacter_Valeur_Nom = '';
                        this.contacter_Valeur_Prenom = '';
                        this.contacter_Valeur_Courriel = '';
                        this.contacter_Valeur_Commentaire = '';
                    },
                    error: (error) => {
                        console.error("Erreur lors de l'envoi du message:", error);
                    }
                });
        }
    }

    getUserMessages(): Promise<any> {
        // @ts-ignore
        const username: string = sessionStorage.getItem('username');
        // @ts-ignore
        const token: string = sessionStorage.getItem('authToken');

        return new Promise((resolve, reject) => {
            this.messageService.getMessages(username, token).subscribe({
                next: (response) => {
                    if (response.data && response.data.length > 0) {
                        this.messages = response.data;
                    } else {
                        console.log('Aucun message trouvé.');
                    }
                    resolve(response);
                },
                error: (error) => {
                    console.error('Erreur lors de la récupération des messages:', error);
                    reject(error);
                }
            });
        });
    }

    verifier_Saisie_Nom() {
        const nomRegex = /^[a-zA-Z][a-zA-Z_' ]*$/;
        this.contacter_Nom_Valide = nomRegex.test(this.contacter_Valeur_Nom);
        this.nom_load = true;
        this.verifier_Formulaire();
    }

    verifier_Saisie_Prenom() {
        const prenomRegex = /^[a-zA-Z][a-zA-Z-' ]*$/;
        this.contacter_Prenom_Valide = prenomRegex.test(this.contacter_Valeur_Prenom);
        this.prenom_load = true;
        this.verifier_Formulaire();
    }

    verifier_Saisie_Courriel() {
        const courrielRegex = /^[A-Za-z0-9]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/;
        this.contacter_Courriel_Valide = courrielRegex.test(this.contacter_Valeur_Courriel);
        this.courriel_load = true;
        this.verifier_Formulaire();
    }

    verifier_Formulaire() {
        this.contacter_Is_Form_Valid =
            this.contacter_Nom_Valide &&
            this.contacter_Prenom_Valide &&
            this.contacter_Courriel_Valide &&
            this.contacter_Limite_Valide;
    }

    verifier_Limite_Caracteres() {
        this.nombreCaracteres = this.contacter_Valeur_Commentaire.length;
        if (this.nombreCaracteres >= this.limiteCaracteres) {
            this.contacter_Limite_Error_Message = "contacter_Limite_Error_Message";
        } else {
            this.contacter_Limite_Error_Message = '';
            this.contacter_Limite_Valide = true;
        }

        this.contacter_Limite_Valide = this.nombreCaracteres !== 0;

        this.commentaire_load = true;
        this.verifier_Formulaire();
    }

    resetFormulaireOnSubmit(): void {
        let button = document.getElementById('btn-envoyer')!;

        button.classList.remove('btn-danger');
        button.classList.add('bg-success');

        this.nombreCaracteres = 0;
        this.contacter_Button_Envoyer = 'contacter_Envoyee';

        setTimeout(() => {
            button.classList.remove('bg-success');
            button.classList.add('btn-danger');
            this.contacter_Is_Form_Valid = false;
            this.contacter_Button_Envoyer = 'contacter_Envoyer';
        }, 2000);
    }

    async afficherMessages(): Promise<void> {
        await this.getUserMessages();
        const dialogRef = this.dialog.open(PopupMessagesComponent, {
            data: { messages: this.messages }
        });
    }
}
