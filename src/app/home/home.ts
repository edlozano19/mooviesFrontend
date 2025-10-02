import { Component, computed } from '@angular/core';
import { Auth } from '../core/auth';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  constructor(private authService: Auth){}

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

  logout(): void {
    this.authService.logout();
  }
}
