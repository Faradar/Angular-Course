import { Injectable } from '@angular/core';
import { User } from '../../models';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authUser$ = new BehaviorSubject<User | null>(null);
  authUser$: Observable<User | null> = this._authUser$.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): void {
    this.http
      .get<User[]>(
        `http://localhost:3000/users?email=${email}&password=${password}`
      )
      .subscribe({
        next: (res) => {
          const user = res[0];

          if (user) {
            localStorage.setItem('token', user.token);
            this.router.navigate(['/dashboard']);
            this._authUser$.next(user);
          } else {
            alert('Invalid credentials');
          }
        },
      });
  }

  loginApi(email: string, password: string): Observable<User> {
    return this.http
      .get<User[]>(
        `http://localhost:3000/users?email=${email}&password=${password}`
      )
      .pipe(
        map((arr) => {
          if (arr.length) {
            return arr[0];
          } else {
            throw new Error('Invalid credentials');
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this._authUser$.next(null);
  }

  verifyToken(): Observable<User | boolean> {
    const storedToken = localStorage.getItem('token');
    return this.http
      .get<User[]>(`http://localhost:3000/users?token=${storedToken}`)
      .pipe(
        map((res) => {
          const user = res[0];
          if (user) {
            localStorage.setItem('token', user.token);
            this._authUser$.next(user);
            return user;
          } else {
            return false;
          }
        })
      );
  }
}
