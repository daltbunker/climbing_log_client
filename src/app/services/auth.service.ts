import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private contentTypeHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  loggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>('api/auth/login', { username, password }, { headers: this.contentTypeHeaders });
  }

  signup(username: string, password: string) {
    return this.http.post<any>('api/auth/signup', {username, password}, { headers: this.contentTypeHeaders });
  }

  logout() {
    this.loggedIn.next(false);
    localStorage.removeItem('token_id');
    localStorage.removeItem('expiration');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  }

  updateLoginState(): void {
    const expiration = localStorage.getItem('expiration')
    if (expiration) {
      const expirationTime = new Date(expiration).getTime();
      const currentTime = new Date().getTime();
      if (expirationTime > currentTime) {
        this.loggedIn.next(true);
        return;
      } 
    }
    this.loggedIn.next(false);
  }

  setSession(authResult: { token: string, expiration: string, username: string, role: string }) {
    localStorage.setItem('role', authResult.role)
    localStorage.setItem('token_id', authResult.token);
    localStorage.setItem('expiration', authResult.expiration);
    localStorage.setItem('username', authResult.username);
    this.loggedIn.next(true);
  }    

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }
}
