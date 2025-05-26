import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { User } from '../../../../models';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUserById(id: string): Observable<User | null> {
    return this.http
      .get<User>(`${this.baseUrl}/${id}`)
      .pipe(catchError(() => of(null)));
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${user.id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
