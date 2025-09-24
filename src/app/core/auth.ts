import { Injectable, signal } from '@angular/core';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private isLoggedIn = signal(false);
  private currentUser = signal<User | undefined>(undefined);

  constructor() {
    this.checkStoredAuth();
  }

  login(credentials: LoginRequest): LoginResponse {
    if (credentials.username === 'admin' && credentials.password === 'password') {
      const mockUser: User = {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        firstName: 'John',
        lastName: 'Admin',
      };

      this.isLoggedIn.set(true);
      this.currentUser.set(mockUser);

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(mockUser));

      return { success: true, user: mockUser };
    }
    else {
      return { success: false, error: 'Invalid credentials' };
    }
  }

  logout(): void {
    this.isLoggedIn.set(false);
    this.currentUser.set(undefined);

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
  }

  getIsLoggedIn() {
    return this.isLoggedIn();
  }

  getCurrentUser() {
    return this.currentUser();
  }

  private checkStoredAuth() {
    const storedLogin = localStorage.getItem('isLoggedIn');
    const storedUser = localStorage.getItem('currentUser');

    if (storedLogin === 'true' && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.isLoggedIn.set(true);
        this.currentUser.set(user);
      } catch (error) {
        this.logout();
      }
    }
  }
  
}
