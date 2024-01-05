import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AideComponent } from './aide/aide.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DocumentationComponent } from './documentation/documentation.component';
import { ContacterComponent } from './contacter/contacter.component';
import { CreerReunionComponent } from './creer-reunion/creer-reunion.component';
import { ReunionsComponent } from './reunions/reunions.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { VoirReunionComponent } from './voir-reunion/voir-reunion.component';
import {CdkTableModule} from "@angular/cdk/table";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {FlexModule} from "@angular/flex-layout";
import {MatSortModule} from "@angular/material/sort";
import { NonConnecteModalComponent } from './non-connecte-modal/non-connecte-modal.component';
import {AuthentificationService} from "./connexion/authentification.service";
import {MessageService} from "./contacter/message.service";
import { PopupMessagesComponent } from './popup-messages/popup-messages.component';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from "@angular/material/input";
import {DatePipe, NgFor} from "@angular/common";

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}



@NgModule({
    declarations: [
        AppComponent,
        AideComponent,
        ConnexionComponent,
        FooterComponent,
        MainComponent,
        NavbarComponent,
        DocumentationComponent,
        ContacterComponent,
        CreerReunionComponent,
        ReunionsComponent,
        NotFoundComponent,
        VoirReunionComponent,
        NonConnecteModalComponent,
        PopupMessagesComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        FormsModule,
        BrowserAnimationsModule,
        MatRadioModule,
        MatIconModule,
        HttpClientModule,
        CdkTableModule,
        MatTableModule,
        MatButtonModule,
        MatDialogModule,
        FlexModule,
        MatSortModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        MatInputModule,
        NgFor,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
    ],
    providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        [AuthentificationService],
        MessageService,
        [DatePipe]
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}
