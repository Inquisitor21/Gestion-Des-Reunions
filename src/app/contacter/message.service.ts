import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    constructor(private http: HttpClient) {}

    sendMessage( nom: string, prenom: string, email: string, telephone: string, message: string, token: string): Observable<any> {
        const body = { nom: nom, prenom: prenom, email: email, telephone: telephone, message: message };
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: token,
            }),
        };
        return this.http.put(`https://cegep.fdtt.space/v1/contact/${prenom}`, body, options);
    }

    getMessages(username: string, token: string): Observable<any> {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: token,
            }),
        };
        return this.http.get(`https://cegep.fdtt.space/v1/contact/${username}`, options);
    }
}
