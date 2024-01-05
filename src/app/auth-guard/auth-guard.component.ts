import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NonConnecteModalComponent } from '../non-connecte-modal/non-connecte-modal.component';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private dialog: MatDialog) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        const isLoggedIn = sessionStorage.getItem('username') !== null;
        if (isLoggedIn) {
            return true;
        } else {
            this.openNonConnecteModal();
            return false;
        }
    }

    private openNonConnecteModal(): void {
        this.dialog.open(NonConnecteModalComponent, {
            width: '350px',
            disableClose: true, // Empêche la fermeture par clic à l'extérieur
        });
    }
}
