import { Component, OnInit, signal } from '@angular/core';
import { Auth } from '../core/auth';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  welcomeMessage = signal(`Welcome to Moovies!`);
  isLoggedIn = signal(false);
  userName = signal<string | undefined>(undefined);

  constructor(private authService: Auth){}
  
  ngOnInit(): void {
    this.updateWelcomeMessage();
  }

  updateWelcomeMessage(): void {
    const currentUser = this.authService.getCurrentUser();
    this.isLoggedIn.set(this.authService.getIsLoggedIn());
    
    if (this.isLoggedIn() && currentUser) {
      this.userName.set(`${currentUser.firstName} ${currentUser.lastName}`);
      this.welcomeMessage.set(`Welcome back, ${currentUser.firstName}!`);
    }
    else {
      this.userName.set(undefined);
      this.welcomeMessage.set(`Welcome to Moovies!`);
    }
  }

  logout(): void {
    this.authService.logout();
    this.updateWelcomeMessage();
  }
}
