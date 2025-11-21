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
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  isAdmin$ = this.user$.pipe(map(user => user?.rol === 'Admin'));

  constructor() {
    this.loadFromStorage();
  }

  // Cambiado: recibe un objeto User
  login(user: User) {
    this.userSubject.next(user);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout() {
    this.userSubject.next(null);
    sessionStorage.removeItem('currentUser');
  }

  private loadFromStorage() {
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
      this.userSubject.next(JSON.parse(userStr));
    }
  }
}