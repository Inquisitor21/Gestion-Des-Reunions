import {HttpClient} from '@angular/common/http';
import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-voir-reunion',
    templateUrl: './voir-reunion.component.html',
    styleUrls: ['./voir-reunion.component.css']
})
export class VoirReunionComponent {

    selectedLanguage: string = 'fr';
    reunionDetails: any;
    showModal: boolean = false;
    showParticipantForm: boolean = false;

    reunion_Valeur_Nom: string = '';
    reunion_Valeur_Prenom: string = '';
    reunion_Valeur_ID_Reunion: string = '';
    reunion_Is_Form_Valid: boolean = false;

    nom_load: boolean = false;
    prenom_load: boolean = false;
    id_load: boolean = false;

    reunion_Nom_Valide!: boolean;
    reunion_Prenom_Valide!: boolean;
    reunion_ID_Reunion_Valide!: boolean;

    participantForm: FormGroup;

    participant = {
        nom: '',
        prenom: '',
        disponnible: ''
    };

    constructor(private http: HttpClient, private formBuilder: FormBuilder, private translate: TranslateService) {
        this.reunion_Valeur_Nom = sessionStorage.getItem('reunion_Valeur_Nom') as string;
        this.reunion_Valeur_Prenom = sessionStorage.getItem('reunion_Valeur_Prenom') as string;

        this.participantForm = this.formBuilder.group({
            nom: [this.reunion_Valeur_Nom],
            prenom: [this.reunion_Valeur_Prenom],
            disponnible: ['', [Validators.required, Validators.pattern('^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-20(0[0-9]|1[0-9]|2[3-4])\\s(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-20(0[0-9]|1[0-9]|2[3-5])$'), this.exactLengthValidator(21)]]
        });

        window.addEventListener('beforeunload', () => this.viderSessionStorage());
    }

    recupererValeurs() {
        this.reunion_Valeur_Nom = sessionStorage.getItem('reunion_Valeur_Nom') || '';
        this.reunion_Valeur_Prenom = sessionStorage.getItem('reunion_Valeur_Prenom') || '';

        this.participantForm.get('nom')?.setValue(this.reunion_Valeur_Nom);
        this.participantForm.get('prenom')?.setValue(this.reunion_Valeur_Prenom);
    }

    exactLengthValidator(length: number) {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const isExactLength = control.value && control.value.length === length;
            return !isExactLength ? {'exactLength': {value: control.value}} : null;
        };
    }

    capturer_Inputs_Reunion_Voir() {
        sessionStorage.setItem('reunion_Valeur_Nom', this.reunion_Valeur_Nom);
        sessionStorage.setItem('reunion_Valeur_Prenom', this.reunion_Valeur_Prenom);

        this.getAllReunions().subscribe({
            next: (response: any) => {
                this.afficherDetailsReunion(response, this.reunion_Valeur_ID_Reunion);
                this.showModal = true;
                this.recupererValeurs();
            },
            error: (error: any) => {
                console.error(error);
            }
        });
    }

    afficherDetailsReunion(reunions: any[], reunionId: string) {
        this.reunionDetails = reunions.find(r => r.reunion_id === reunionId);
        if (!this.reunionDetails) {
            console.log(`Réunion avec ID : ${reunionId} n'existe pas`);
        }
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

    reunion_verifier_Saisie_ID_Reunion() {
        this.reunion_ID_Reunion_Valide = this.reunion_Valeur_ID_Reunion.length == 8;
        this.id_load = true;
        this.verifier_Formulaire();
    }

    verifier_Formulaire() {
        this.reunion_Is_Form_Valid =
            this.reunion_Nom_Valide &&
            this.reunion_Prenom_Valide &&
            this.reunion_ID_Reunion_Valide;
    }

    getAllReunions() {
        return this.http.get(`https://us-central1-tp3-vazgen-markaryan.cloudfunctions.net/reunion`);
    }

    ajouterParticipant() {
        if (this.participantForm.valid) {
            const body = {participant: this.participantForm.value};
            const params = {id: this.reunion_Valeur_ID_Reunion};

            this.http.post(`https://us-central1-tp3-vazgen-markaryan.cloudfunctions.net/reunion`, body, {params: params}).subscribe({
                next: (response: any) => {
                    this.trigger();
                    this.getAllReunions().subscribe({
                        next: (response: any) => {
                            this.afficherDetailsReunion(response, this.reunion_Valeur_ID_Reunion);
                        },
                        error: (error: any) => {
                            console.error(error);
                        }
                    });
                },
                error: (error: any) => {
                    console.error(error);
                }
            });
        }
    }

    async trigger() {
        this.viderSessionStorage();
        this.participantForm.reset();
        this.showParticipantForm = false;

        let button = document.getElementById("rejoindre");
        if (button) {
            const changeMessage = await this.translate.get('participation_changement').toPromise();

            button.classList.remove("btn-primary");
            button.classList.add("btn-success");
            button.innerHTML = changeMessage;
        }
    }

    viderSessionStorage() {
        sessionStorage.removeItem('reunion_Valeur_Nom');
        sessionStorage.removeItem('reunion_Valeur_Prenom');
    }

    isParticipant(reunion_id: string): boolean {
        const reunion = this.reunionDetails;
        return reunion?.participants.some((p: {
            nom: string;
            prenom: string;
        }) => p.nom === this.reunion_Valeur_Nom && p.prenom === this.reunion_Valeur_Prenom);
    }
}
