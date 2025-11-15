// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface User {
  id: number;
  nombre: string;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(this.loadFromSession());
  public user$ = this.userSubject.asObservable();
  public isAdmin$ = this.user$.pipe(map(u => !!u && u.rol === 'admin'));

  private api = 'http://localhost:4000/api/catalogo';

  private loadFromSession(): User | null {
    const s = sessionStorage.getItem('currentUser');
    return s ? JSON.parse(s) as User : null;
  }

  private saveToSession(user: User | null) {
    if (user) sessionStorage.setItem('currentUser', JSON.stringify(user));
    else sessionStorage.removeItem('currentUser');
    this.userSubject.next(user);
  }

  // login con fetch
  async login(username: string, password: string): Promise<boolean> {
    try {
      const resp = await fetch(`${this.api}/iniciar-sesion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!resp.ok) return false;
      const data = await resp.json();
      if (!data.success) return false;

      const user: User = data.user;
      this.saveToSession(user);
      return true;
    } catch (e) {
      console.error('Login error', e);
      return false;
    }
  }

  logout() {
    this.saveToSession(null);
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }
}