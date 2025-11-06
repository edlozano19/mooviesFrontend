import { Component, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../core/auth';
import { NotificationService } from '../core/notification.service';
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
    private router: Router,
    private notificationService: NotificationService
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
    console.log(user);

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
    if (this.isLoggedIn()) {
      this.usersService.refreshUsers();
    }
  }

  logout(): void {
    const confirmed = this.authService.confirmAndLogout();

    if (confirmed) {
      this.notificationService.success('You have been logged out successfully');
      this.router.navigate(['/']);
    }
  }
}
