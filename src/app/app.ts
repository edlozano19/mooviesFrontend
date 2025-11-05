import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Auth } from './core/auth';
import { NotificationComponent } from './core/notification.component';
import { NotificationService } from './core/notification.service';
import { SearchBarComponent } from './movies/components/search-bar/search-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NotificationComponent, SearchBarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mooviesFrontend');

  constructor(
    protected authService: Auth,
    protected router: Router,
    private notificationService: NotificationService
  ) {}

  isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  logout() {
    const confirmed = this.authService.confirmAndLogout();

    if (confirmed) {
      this.notificationService.success('You have been logged out successfully');
      this.router.navigate(['/']);
    }
  }
}
