import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {AuthentificationService} from "./authentification.service";

@Component({
    selector: 'app-connexion',
    templateUrl: './connexion.component.html',
    styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {
    @Input() selectedLanguage = 'fr';
    @Output() etatConnexionChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private translate: TranslateService, private authService: AuthentificationService) {
        translate.setDefaultLang(this.selectedLanguage);
    }

    //Mettre à jour l'interface après le rafraîchissement de la page
    ngOnInit(): void {
        if (sessionStorage.getItem('authToken')) {
            this.token = sessionStorage.getItem('authToken') as string;
        }
        this.authService.estAuthentifie() ? this.connecterUtilisateurMAJ() : this.deconnecterUtilisateurMAJ();
    }


    // Propriétés pour le formulaire de "Connexion"
    //Nom du formulaire + Nom de la variable/du champ
    connexion_Valeur_Pseudonime: string = '';
    connexion_Valeur_Password: string = '';
    connexion_Active: boolean = true;
    connexion_Pseudonime_Valide: boolean = false;
    connexion_Password_Valide: boolean = false;
    connexion_Is_Form_Valid: boolean = false;
    connexion_Pseudonime_Error_Message: string = '';
    connexion_Password_Error_Message: string = '';

    // Fonction pour vérifier la saisie du nom d'utilisateur (Connexion)
    verifier_Saisie_Pseudonime() {
        // Validation du nom d'utilisateur : doit être composé de lettres et de chiffres, peut contenir des majuscules.
        const pseudonimeRegex = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9]+$/;

        if (!pseudonimeRegex.test(this.connexion_Valeur_Pseudonime)) {
            this.connexion_Pseudonime_Valide = false;
            this.translate.get("connexion_Pseudonime_Error").subscribe((message: string) => {
                this.connexion_Pseudonime_Error_Message = message;
            });
        } else {
            this.connexion_Pseudonime_Valide = true;
        }
        this.verifier_Formulaire_Connexion();
    }

    // Fonction pour vérifier la saisie du mot de passe (Connexion)
    verifier_Saisie_Password() {
        // Validation du mot de passe : au moins 8 caractères, 1 majuscule et 1 chiffre
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!passwordRegex.test(this.connexion_Valeur_Password)) {
            this.connexion_Password_Valide = false;
            this.translate.get("connexion_Password_Error").subscribe((message: string) => {
                this.connexion_Password_Error_Message = message;
            });
        } else {
            this.connexion_Password_Valide = true;
        }
        this.verifier_Formulaire_Connexion();
    }

    // Fonction pour activer le formulaire (Connexion)
    activer_Connexion() {
        this.connexion_Active = true;
        this.inscription_Inscription_Active = false;
        this.MDP_Oublie_MDP_Oublie_Active = false;
    }

    // Fonction pour vérifier la validité globale du formulaire (Connexion)
    verifier_Formulaire_Connexion() {
        this.connexion_Is_Form_Valid = this.connexion_Pseudonime_Valide && this.connexion_Password_Valide;
    }


    // Propriétés pour le formulaire "Inscription"
    //Nom du formulaire + Nom de la variable/du champ
    inscription_Valeur_Pseudonime: string = '';
    inscription_Valeur_Password: string = '';
    inscription_Valeur_Confirmation: string = '';
    inscription_Inscription_Active: boolean = false;
    inscription_Pseudonime_Valide: boolean = false;
    inscription_Password_Valide: boolean = false;
    inscription_Confirmation_Valide: boolean = false;
    inscription_Is_Form_Valid: boolean = false;
    inscription_Pseudonime_Error_Message: string = '';
    inscription_Password_Error_Message: string = '';
    inscription_Confirmation_Error_Message: string = '';
    dummyEmail: string = 'DummyEmail@gmail.com';
    key: string = 'cal41202';
    token: string = '';

    // Fonction pour capturer les données du formulaire (Inscription) et connecter l'utilisateur
    capturer_Inputs_Inscription() {
        this.authService.createUser(this.inscription_Valeur_Pseudonime, this.inscription_Valeur_Password, this.dummyEmail, this.key)
            .subscribe({
                next: () => {
                    // Traitement réussi
                    this.authService.login(this.inscription_Valeur_Pseudonime, this.inscription_Valeur_Password)
                        .subscribe({
                            next: (tokenRecu) => {
                                // Traitement réussi
                                this.token = tokenRecu.data;

                                //Ajouter dans le SessionStorage pour mettre à jour l'interface
                                sessionStorage.setItem('authToken', this.token);
                                sessionStorage.setItem('user_' + this.inscription_Valeur_Pseudonime, 'true');
                                sessionStorage.setItem('username', this.inscription_Valeur_Pseudonime);

                                // Vérifier l'authentification
                                this.verifierAuthentification();
                            }
                        });
                },
                error: () => {
                    // Gestion des erreurs
                    const message = this.translate.instant('connexion_Authentification_Erreur');
                    alert(message);
                }
            });
    }

    // Fonction pour déconnecter l'utilisateur
    deconnecterUtilisateur = () => {
        this.authService.logout(this.token)
            .subscribe({
                next: () => {
                    // Traitement réussi
                    sessionStorage.removeItem('user_' + sessionStorage.getItem('username'));
                    sessionStorage.removeItem('username');
                    //Mettre à jour l'interface après la déconnexion
                    this.deconnecterUtilisateurMAJ();
                }
            });
    };

    // Fonction pour vérifier l'authentification (Inscription)
    verifierAuthentification() {
        const loggedIn = sessionStorage.getItem('user_' + sessionStorage.getItem('username'));
        if (loggedIn === 'true') {
            this.connecterUtilisateurMAJ();
            this.connexion_Active = true;
            this.inscription_Inscription_Active = false;
            this.MDP_Oublie_MDP_Oublie_Active = false;
            this.inscription_Valeur_Pseudonime = '';
            this.inscription_Valeur_Password = '';
            this.inscription_Valeur_Confirmation = '';
            this.etatConnexionChange.emit(true);
        } else {
            this.etatConnexionChange.emit(false);
            this.deconnecterUtilisateur();
        }
    }

    // Fonction pour vérifier la saisie du nom d'utilisateur (Inscription)
    verifierConnexion() {
        this.authService.login(this.connexion_Valeur_Pseudonime, this.connexion_Valeur_Password).subscribe({
            next: (tokenRecu) => {
                this.token = tokenRecu.data;
                // Traitement réussi
                sessionStorage.setItem('user_' + this.connexion_Valeur_Pseudonime, 'true');
                sessionStorage.setItem('username', this.connexion_Valeur_Pseudonime);
                sessionStorage.setItem('authToken', this.token);

                this.connecterUtilisateurMAJ();
                this.connexion_Valeur_Pseudonime = '';
                this.connexion_Valeur_Password = '';
            },
            error: () => {
                // Gestion des erreurs
                const message = this.translate.instant('connexion_Connexion_Erreur');
                alert(message);
            }
        });
    }

    // Fonction pour connecter l'utilisateur (Inscription)
    connecterUtilisateurMAJ() {
        const connexionButton = document.getElementById('connexionButton');
        const deconnexionButton = document.getElementById('deconnexionButton');
        const usernameButton = document.getElementById('usernameButton');

        if (connexionButton) {
            connexionButton.classList.add('d-none');
        }

        if (deconnexionButton) {
            deconnexionButton.classList.remove('d-none');
            deconnexionButton.addEventListener('click', this.deconnecterUtilisateur);
        }

        if (usernameButton) {
            const username = sessionStorage.getItem('username');
            if (username) {
                usernameButton.innerText = username;
                usernameButton.classList.remove('d-none');
            }
        }
    }

    // Fonction pour mettre à jours l'interface du Navbar après deconnexion (Inscription)
    deconnecterUtilisateurMAJ() {
        sessionStorage.removeItem('user_' + sessionStorage.getItem('username'));
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('authToken');
        const connexionButton = document.getElementById('connexionButton');
        const deconnexionButton = document.getElementById('deconnexionButton');
        const usernameButton = document.getElementById('usernameButton');

        if (connexionButton) {
            connexionButton.classList.remove('d-none');
        }

        if (deconnexionButton) {
            deconnexionButton.classList.add('d-none');
            deconnexionButton.removeEventListener('click', this.deconnecterUtilisateur);
        }

        if (usernameButton) {
            usernameButton.innerText = '';
            usernameButton.classList.add('d-none');
        }
    }

    // Fonction pour vérifier la saisie du nom d'utilisateur (Inscription)
    verifier_Saisie_Pseudonime_Inscription() {
        // Validation du nom d'utilisateur : doit être composé de lettres et de chiffres, peut contenir des majuscules.
        const pseudonimeRegex = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9]+$/;

        if (!pseudonimeRegex.test(this.inscription_Valeur_Pseudonime)) {
            this.inscription_Pseudonime_Valide = false;
            this.translate.get("inscription_Pseudonime_Error").subscribe((message: string) => {
                this.inscription_Pseudonime_Error_Message = message;
            });
        } else {
            this.inscription_Pseudonime_Valide = true;
        }
        this.verifier_Formulaire_Inscription();
    }

    // Fonction pour vérifier la saisie du mot de passe (Inscription)
    verifier_Saisie_Password_Inscription() {
        // Validation du mot de passe (inscription) : au moins 8 caractères, 1 majuscule et 1 chiffre
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!passwordRegex.test(this.inscription_Valeur_Password)) {
            this.inscription_Password_Valide = false;
            this.translate.get("inscription_Password_Error").subscribe((message: string) => {
                this.inscription_Password_Error_Message = message;
            });
        } else {
            this.inscription_Password_Valide = true;
        }
        this.verifier_Formulaire_Inscription();
    }

    // Fonction pour vérifier la saisie de la confirmation du mot de passe (Inscription)
    verifier_Saisie_Confirmation() {
        if (this.inscription_Valeur_Confirmation !== this.inscription_Valeur_Password) {
            this.inscription_Confirmation_Valide = false;
            this.translate.get("inscription_Confirmation_Error").subscribe((message: string) => {
                this.inscription_Confirmation_Error_Message = message;
            });
        } else {
            this.inscription_Confirmation_Valide = true;
        }
        this.verifier_Formulaire_Inscription();
    }

    // Fonction pour activer le formulaire "Inscription"
    activer_Inscription() {
        this.inscription_Inscription_Active = true;
        this.connexion_Active = false;
        this.MDP_Oublie_MDP_Oublie_Active = false;
    }

    // Fonction pour vérifier la validité globale du formulaire (Inscription)
    verifier_Formulaire_Inscription() {
        this.inscription_Is_Form_Valid = this.inscription_Pseudonime_Valide && this.inscription_Password_Valide && this.inscription_Confirmation_Valide;
    }


    // Propriétés pour le formulaire "Mot de passe oublié"
    //Nom du formulaire + Nom de la variable/du champ
    MDP_Oublie_MDP_Oublie_Active: boolean = false;
    MDP_Oublie_Valeur_Courriel: string = '';
    MDP_Oublie_Valeur_Pseudonime: string = '';
    MDP_Oublie_Courriel_Invalide: boolean = false;
    MDP_Oublie_Courriel_Error_Message: string = '';
    MDP_Oublie_Is_Form_Valid: boolean = false;
    MDP_Oublie_Courriel_Format_Valide: boolean = true;
    MDP_Oublie_Requete_Envoyee: boolean = false;
    MDP_Oublie_Pseudonime_Invalide: boolean = false;
    MDP_Oublie_Pseudonime_Error_Message: string = '';

    // Fonction pour capturer les données du formulaire (MDP Oublié)
    capturer_Inputs_MDP_Oublie() {
        if (this.MDP_Oublie_Courriel_Invalide || !this.MDP_Oublie_Courriel_Format_Valide) {
            console.log('Formulaire Mot de passe oublié invalide. Vérifiez les champs.');
        } else {
            console.log('Nom d\'utilisateur (Mot de passe oublié) :', this.MDP_Oublie_Valeur_Pseudonime);
            console.log('Courriel (Mot de passe oublié) :', this.MDP_Oublie_Valeur_Courriel);
            // Envoyer les données au serveur ou effectuer d'autres actions ici.
        }
    }

    // Fonction pour vérifier la saisie du pseudonime (MPD Oublié)
    verifier_Saisie_Pseudonime_MDP_Oublie() {
        // Validation du nom d'utilisateur : doit être composé de lettres et de chiffres, peut contenir des majuscules.
        const pseudonimeRegex = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9]+$/;

        if (!pseudonimeRegex.test(this.MDP_Oublie_Valeur_Pseudonime)) {
            this.MDP_Oublie_Pseudonime_Invalide = true;
            this.translate.get("MDP_Oublie_Pseudonime_Error").subscribe((message: string) => {
                this.MDP_Oublie_Pseudonime_Error_Message = message;
            });
        } else {
            this.MDP_Oublie_Pseudonime_Invalide = false;
        }
        this.verifier_Formulaire_MDP_Oublie();
    }

    // Fonction pour vérifier la saisie du courriel (MDP Oublié)
    verifier_Saisie_Courriel_MDP_Oublie() {
        // Expression régulière pour valider le format d'une adresse courriel
        const courrielRegex = /^[A-Za-z0-9]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/;


        // Vérification du format du courriel
        if (!courrielRegex.test(this.MDP_Oublie_Valeur_Courriel)) {
            this.MDP_Oublie_Courriel_Format_Valide = false;
            this.MDP_Oublie_Courriel_Invalide = true;
            this.translate.get("MDP_Oublie_Courriel_Invalide_Error").subscribe((message: string) => {
                this.MDP_Oublie_Courriel_Error_Message = message;
            });
        } else {
            this.MDP_Oublie_Courriel_Format_Valide = true;
            this.MDP_Oublie_Courriel_Invalide = false;
            this.MDP_Oublie_Courriel_Error_Message = '';
        }
        this.verifier_Formulaire_MDP_Oublie();
    }

    // Fonction pour envoyer la demande de Réinitialisation (MDP Oublié)
    envoyer_Demande_Reinitialisation() {
        this.MDP_Oublie_Requete_Envoyee = true;

        if (this.MDP_Oublie_Is_Form_Valid) {
            console.log('Demande de réinitialisation envoyée pour le courriel :', this.MDP_Oublie_Valeur_Courriel);
            // Dans le futur, je peux ajouter une requête HTTP ici pour envoyer la demande au serveur.

            // Réinitialiser le formulaire
            setTimeout(() => {
                this.MDP_Oublie_Requete_Envoyee = false;
            }, 1000000000); // Afficher le message de succès pendant infiniment longtemps
        } else {
            console.log('Formulaire Mot de passe oublié invalide. Vérifiez les champs.');
            // Je réinitialise également MDP_Oublie_Requete_Envoyee en cas d'erreur.
            this.MDP_Oublie_Requete_Envoyee = false;
        }
    }

    // Fonction pour activer le formulaire (MDP Oublié)
    activer_MDP_Oublie() {
        this.MDP_Oublie_MDP_Oublie_Active = true;
        this.connexion_Active = false;
        this.inscription_Inscription_Active = false;
    }

    // Fonction pour vérifier la validité globale du formulaire (MDP oublié)
    verifier_Formulaire_MDP_Oublie() {
        this.MDP_Oublie_Is_Form_Valid = !this.MDP_Oublie_Courriel_Invalide;
    }
}
