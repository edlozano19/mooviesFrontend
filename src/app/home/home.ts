import { Component, computed, OnInit } from '@angular/core';
import { Auth } from '../core/auth';
import { UsersService } from '../core/users.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  constructor(
    private authService: Auth,
    private usersService: UsersService,
  ) {}

  isLoggedIn = computed(() => this.authService.getIsLoggedIn());
  currentUser = computed(() => this.authService.getCurrentUser());

  userName = computed(() => {
    const user = this.currentUser();
    return user ? `${user.firstName} ${user.lastName}` : undefined;
  });

  welcomeMessage = computed(() => {
    const user = this.currentUser();
    const loggedIn = this.isLoggedIn();

    if (loggedIn && user) {
      return `Welcome back, ${user.firstName}!`;
    }
    else {
      return `Welcome to Moovies!`;
    }
  });

  activeUsers = computed(() => this.usersService.getActiveUsersForDisplay());
  activeUserCount = computed(() => this.usersService.activeUserCount());
  isLoadingUsers = computed(() => this.usersService.getIsLoading());

  ngOnInit(): void {
    this.usersService.refreshUsers();
  }

  logout(): void {
    this.authService.logout();
  }
}
