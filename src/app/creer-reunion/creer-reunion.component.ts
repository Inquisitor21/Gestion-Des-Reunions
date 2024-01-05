import {Component, Input} from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {DatePipe} from '@angular/common';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

export interface ReunionElement {
    nom: string;
    prenom: string;
    courriel: string;
    identificateur: string;
    dateStart: string;
    dateEnd: string;
    description: string;
}

@Component({
    selector: 'app-creer-reunion',
    templateUrl: './creer-reunion.component.html',
    styleUrls: ['./creer-reunion.component.css'],

})

export class CreerReunionComponent {
    startDate: string | null | undefined;
    endDate: string | null | undefined;

    constructor(private datePipe: DatePipe, private http: HttpClient) {
    }

    @Input() selectedLanguage = 'fr';

    reunion_Valeur_Nom: string = '';
    reunion_Valeur_Prenom: string = '';
    reunion_Valeur_Courriel: string = '';
    reunion_Valeur_Description: string = '';
    reunion_Valeur_ID_Reunion: string = '';
    reunion_button_Creer: string = 'creer_reunion_Creer'

    prenom_utilisateur = sessionStorage.getItem('username');

    reunion_Is_Form_Valid: boolean = false;
    nom_load = false;
    prenom_load = false;
    courriel_load = false;
    description_load = false;
    id_load = false;

    reunion_Nom_Valide!: boolean;
    reunion_Prenom_Valide!: boolean;
    reunion_Courriel_Valide!: boolean;
    reunion_ID_Reunion_Valide!: boolean;
    reunion_Limite_Valide!: boolean;

    reunion_Limite_Error_Message: string = '';

    limiteCaracteres = 250; // Nombre maximum de caractères autorisés
    nombreCaracteres = 0; // Nombre actuel de caractères
    creer_Reunion() {
        if (this.reunion_Is_Form_Valid) {

            this.postReunion(
                this.reunion_Valeur_Nom,
                this.prenom_utilisateur as string,
                this.reunion_Valeur_Courriel,
                this.reunion_Valeur_ID_Reunion,
                [{
                    nom: this.reunion_Valeur_Nom,
                    prenom: this.reunion_Valeur_Prenom,
                    disponnible: (this.startDate as string + "  -  " + this.endDate as string)
                }],
                this.startDate as string,
                this.endDate as string,
                this.reunion_Valeur_Description
            ).subscribe({
                    next: (response: any) => {
                        console.log(response);
                    },
                    error: (error: any) => {
                        console.log(error);
                    }
                }
            )
        }

        // Réinitialisation des champs
        this.reunion_Valeur_Nom = '';
        this.reunion_Valeur_Prenom = '';
        this.reunion_Valeur_Courriel = '';
        this.reunion_Valeur_Description = '';
        this.reunion_Valeur_ID_Reunion = '';
    }

    verifier_Saisie_Nom() {
        const nomRegex = /^[a-zA-Z][a-zA-Z_' ]*$/;
        this.reunion_Nom_Valide = nomRegex.test(this.reunion_Valeur_Nom);
        this.nom_load = true;
        this.verifier_Formulaire();
    }

    verifier_Saisie_Prenom() {
        const prenomRegex = /^[a-zA-Z][a-zA-Z-' ]*$/;
        this.reunion_Prenom_Valide = prenomRegex.test(this.reunion_Valeur_Prenom);
        this.prenom_load = true;
        this.verifier_Formulaire();
    }

    verifier_Saisie_Courriel() {
        const courrielRegex = /^[A-Za-z0-9]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/;
        this.reunion_Courriel_Valide = courrielRegex.test(this.reunion_Valeur_Courriel);
        this.courriel_load = true;
        this.verifier_Formulaire();
    }

    verifier_Saisie_ID() {
        this.reunion_ID_Reunion_Valide = this.reunion_Valeur_ID_Reunion.length == 8;
        this.id_load = true;
        this.verifier_Formulaire();
    }

    verifier_Formulaire() {
        this.reunion_Is_Form_Valid =
            this.reunion_Nom_Valide &&
            this.reunion_Prenom_Valide &&
            this.reunion_Courriel_Valide &&
            this.reunion_ID_Reunion_Valide &&
            this.reunion_Limite_Valide;

    }

    verifier_Limite_Caracteres() {
        this.nombreCaracteres = this.reunion_Valeur_Description.length;
        if (this.nombreCaracteres >= this.limiteCaracteres) {
            this.reunion_Limite_Error_Message = "creer_reunion_Limite_Error_Message";
        } else {
            this.reunion_Limite_Error_Message = '';
            this.reunion_Limite_Valide = true;
        }

        this.reunion_Limite_Valide = this.nombreCaracteres !== 0;

        this.description_load = true;
        this.verifier_Formulaire();
    }

    resetFormulaireOnSubmit(): void {
        let button = document.getElementById('btn-creer')!;

        button.classList.add('disabled');
        button.classList.remove('btn-danger');
        button.classList.add('btn-success');

        this.nombreCaracteres = 0;
        this.reunion_button_Creer = 'creer_reunion_Reunion_Cree';
        this.creer_Reunion();

        setTimeout(() => {
            button.classList.remove('disabled');
            button.classList.remove('btn-success');
            button.classList.add('btn-danger');
            this.reunion_Is_Form_Valid = false;
            this.reunion_button_Creer = 'creer_reunion_Creer';
            //Reset champs de dates. Je n'ai pas trouvé comment le faire autrement.
            location.reload();
        }, 2000);

    }

    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        const formattedDate = this.datePipe.transform(event.value, 'dd-MM-yyyy');

        if (type === 'start') {
            this.startDate = formattedDate;
        } else if (type === 'end') {
            this.endDate = formattedDate;
        }
    }

    postReunion(
        createur_nom: string,
        createur_prenom: string,
        createur_email: string,
        reunion_id: string,
        participants: [{
            nom: string,
            prenom: string,
            disponnible:string
        }],
        date_debut: string,
        date_fin: string,
        description: string
    ): Observable<any> {
        const body = {
            createur_nom: createur_nom,
            createur_prenom: createur_prenom,
            createur_email: createur_email,
            reunion_id: reunion_id,
            participants: participants,
            date_debut: date_debut,
            date_fin: date_fin,
            description: description
        };

        return this.http.post('https://us-central1-tp3-vazgen-markaryan.cloudfunctions.net/reunion', body);
    }
}
