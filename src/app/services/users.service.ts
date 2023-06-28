import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { env } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users = new BehaviorSubject<[]>([]);

  constructor(private http: HttpClient) { }

  public inIt(): void{
    this.http.get<[]>(env.API_URL + '/getmessages').subscribe((users) => {
      this.users.next(users);
    })
  }

  showAllContacts(): Observable<[]> {
    return this.users.pipe();
  }
}
