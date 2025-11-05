import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { UsersService } from './users.service';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
  token?: string;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface BackendLoginResponse {
  token: string;
  type: string;
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface RegisterRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface BackendRegisterResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
}

export interface RegisterResponse {
  success: boolean;
  user?: BackendRegisterResponse;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private isLoggedIn = signal(false);
  private currentUser = signal<User | undefined>(undefined);
  private authToken = signal<string | null>(null);
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private usersService: UsersService
  ) {
    this.checkStoredAuth();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<BackendLoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        map((response: BackendLoginResponse) => {
          const user: User = {
            id: response.userId,
            username: response.username,
            email: response.email,
            role: response.role,
            firstName: response.firstName,
            lastName: response.lastName
          };

          this.isLoggedIn.set(true);
          this.currentUser.set(user);
          this.authToken.set(response.token);

          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('authToken', response.token);

          return { success: true, user: user, token: response.token };
        }),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Login failed';

          if (error.status === 401) {
            errorMessage = 'Invalid username or password';
          }
          else if (error.status === 0) {
            errorMessage = 'Cannot connect to server';
          }
          else if (error.error?.message) {
            errorMessage = error.error.message;
          }

          return of({ success: false, error: errorMessage });
        })
      );
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<BackendRegisterResponse>(`${this.apiUrl}/auth/register`, request)
      .pipe(
        map((response: BackendRegisterResponse) => {
          return { success: true, user: response };
        }),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Registration failed';

          if (error.status === 409) {
            errorMessage = 'Username or email already exists';
          }
          else if (error.status === 400) {
            errorMessage = 'Invalid request';
          }
          else if (error.status === 0) {
            errorMessage = 'Cannot connect to server';
          }
          else if (error.error?.message) {
            errorMessage = error.error.message;
          }

          return of({ success: false, error: errorMessage });
        })
      );
  }

  logout(): void {
    console.log('logout');
    this.isLoggedIn.set(false);
    this.currentUser.set(undefined);
    this.authToken.set(null);

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');

    this.usersService.clearUsers();
  }

  confirmAndLogout(): boolean {
    const confirmed = window.confirm('Are you sure you want to logout?');
    console.log(confirmed);

    if (confirmed) {
      this.logout();
      return true;
    }

    return false;
  }

  getIsLoggedIn() {
    return this.isLoggedIn();
  }

  getCurrentUser() {
    return this.currentUser();
  }

  getAuthToken() {
     return this.authToken();
  }

  private checkStoredAuth() {
    const storedLogin = localStorage.getItem('isLoggedIn');
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');

    if (storedLogin === 'true' && storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        this.isLoggedIn.set(true);
        this.currentUser.set(user);
        this.authToken.set(storedToken);
      } catch (error) {
        this.logout();
      }
    }
  }
  
}
