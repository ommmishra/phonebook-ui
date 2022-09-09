import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(userCred: any): Observable<any> {
    return this.http.post('login', userCred) as Observable<any>;
  }

  checkCors(): Observable<any> {
    return this.http.get('checkAvailability') as Observable<any>;
  }
}

