import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { GetUserResponse, GetUsersResponse, User, UserDisplay } from './user.interface';

@Injectable({
    providedIn: 'root'
})

export class UsersService {
    private apiUrl = environment.apiUrl;
    private allUsers = signal<User[]>([]);
    private isLoading = signal(false);
    private error = signal<string | null>(null);

    constructor(private http: HttpClient) {}

    activeUsers = computed(() =>
        this.allUsers().filter(user => user.isActive)
    );

    totalUsers = computed(() => this.allUsers().length);
    activeUserCount = computed(() => this.activeUsers().length);

    recentUsers = computed(() =>
        this.activeUsers()
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
    );

    getAllUsers() { return this.allUsers(); }
    getIsLoading(){ return this.isLoading(); }
    getError(){ return this.error(); }

    fetchUsers(): Observable<GetUsersResponse> {
        this.isLoading.set(true);
        this.error.set(null);

        return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
            map((users: User[]) => {
                const activeCount = users.filter(user => user.isActive).length;
                return {
                    users,
                    totalCount: users.length,
                    activeCount
                };
            }),
            tap((response) => {
                this.allUsers.set(response.users);
                this.isLoading.set(false);
            }),
            catchError((error: HttpErrorResponse) => {
                this.isLoading.set(false);
                let errorMessage = 'Failed to fetch users';

                if (error.status === 0) {
                    errorMessage = 'Cannot connect to the server';
                }
                else if (error.status === 403) {
                    errorMessage = 'Access denied - admin privileges required';
                }
                else if (error.error?.message) {
                    errorMessage = error.error.message;
                }

                this.error.set(errorMessage);
                return of({ users: [], totalCount: 0, activeCount: 0 });
            })
        );
    }

    getUserById(id: number): Observable<GetUserResponse | null> {
        return this.http.get<User>(`${this.apiUrl}/users/${id}`).pipe(
            map((user: User) => ({ user })),
            catchError((error: HttpErrorResponse) => {
                console.error('Error fetching user:', error);
                return of(null);
            })
        );
    }

    transformToDisplay(user: User): UserDisplay {
        return {
            id: user.id,
            fullName: `${user.firstName} ${user.lastName}`,
            username: user.username,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            joinedDate: new Date(user.createdAt).toLocaleDateString()
        };
    }

    getUsersForDisplay(): UserDisplay[] {
        return this.allUsers().map(user => this.transformToDisplay(user));
    }

    getActiveUsersForDisplay(): UserDisplay[] {
        return this.activeUsers().map(user => this.transformToDisplay(user));
    }

    refreshUsers(): void {
        this.fetchUsers().subscribe();
    }

    clearError(): void {
        this.error.set(null);
    }

    clearUsers(): void {
        this.allUsers.set([]);
        this.isLoading.set(false);
        this.error.set(null);
    }
}