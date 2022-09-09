import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(private http: HttpClient) { }

  
  addContact(contDetail: any): Observable<any> {
    const token = String(localStorage.getItem('token'));
    const headers= new HttpHeaders()
                  .set('Authorization', token);

    return this.http.post('addContact', contDetail, {'headers': headers}) as Observable<any>;
  }

  deleteContact(deleteDetail: any): Observable<any> {
    // const delete
    const token = String(localStorage.getItem('token'));
    const headers= new HttpHeaders()
                  .set('Authorization', token);

    return this.http.delete('deleteContact', {'headers': headers, 'body': deleteDetail}) as Observable<any>;
  }

  editContact(editDetail: any): Observable<any> {
    // const delete
    const token = String(localStorage.getItem('token'));
    const headers= new HttpHeaders()
                  .set('Authorization', token);

    return this.http.patch('editContact', editDetail, {'headers': headers}) as Observable<any>;
  }
}
