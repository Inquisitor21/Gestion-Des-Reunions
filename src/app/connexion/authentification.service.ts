import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthentificationService {

    constructor(private http: HttpClient) { }

    createUser(username: string, password: string, email: string, key: string): Observable<any> {
        const body = { username: username, password: password, email: email, key: key };
        return this.http.post(`https://cegep.fdtt.space/v1/create_user`, body);
    }

    login(username: string, password: string): Observable<any> {
        const body = { username: username, password: password };
        return this.http.post(`https://cegep.fdtt.space/v1/session`, body);
    }

    logout(token: string): Observable<any> {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: token
            })
        };
        return this.http.delete(`https://cegep.fdtt.space/v1/session`, options);
    }

    estAuthentifie(): boolean {
        const token = sessionStorage.getItem('authToken');
        return !!token;
    }
}
