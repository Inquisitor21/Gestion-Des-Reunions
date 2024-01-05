import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DocumentationComponent} from "./documentation/documentation.component";
import {MainComponent} from "./main/main.component";
import {ContacterComponent} from "./contacter/contacter.component";
import {CreerReunionComponent} from "./creer-reunion/creer-reunion.component";
import {ReunionsComponent} from "./reunions/reunions.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {VoirReunionComponent} from "./voir-reunion/voir-reunion.component";
import {AuthGuard} from "./auth-guard/auth-guard.component";

const routes: Routes = [
    { path: '', component: MainComponent },
    { path: 'documentation', component: DocumentationComponent },
    { path: 'contactez-nous', component: ContacterComponent },
    { path: 'creer-reunion', component: CreerReunionComponent, canActivate: [AuthGuard]},
    { path: 'consulter-reunion', component: VoirReunionComponent },
    { path: 'reunions', component: ReunionsComponent },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
