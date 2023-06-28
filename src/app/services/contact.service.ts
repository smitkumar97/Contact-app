import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,Subject } from 'rxjs';
import { env } from '../config/config';
import 'url-search-params-polyfill'; // For IE support;

const httpOptions = {
  headers: new HttpHeaders().set(
    'Content-Type',
    'application/x-www-form-urlencoded'
  ),
};

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private http: HttpClient) { }

  showAllContacts(): Observable<any> {
    return this.http.get(env.API_URL + '/contacts', { responseType: 'text' });
  }

  getContactDetails(id: any): Observable<any> {
    return this.http.get(env.API_URL + '/contact/' + id, { responseType: 'text'});
  }

  sendMessage(sendMsgto: any, otp: any): Observable<any> {
    let body = new URLSearchParams();
    body.set('to', sendMsgto);
    body.set('otp',otp)
    return this.http.post(env.API_URL + '/sendmessage',body.toString(),httpOptions);
  }

  getListOfMessagesSent() {
    return this.http.get(env.API_URL + '/getmessages', { responseType: 'text' });
  }

  addContacts(id: any, contactDetails: any): Observable<any> {
    let body = new URLSearchParams();
    body.set('id', id);
    body.set('Firstname', contactDetails.Firstname);
    body.set('Lastname', contactDetails.Lastname);
    body.set('phone', contactDetails.phoneNumber);
    body.set('email', contactDetails.email);
    return this.http.post(env.API_URL + '/addcontact', body.toString(), httpOptions);
  }
}
