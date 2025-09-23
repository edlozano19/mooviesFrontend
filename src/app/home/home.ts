import { Component, OnInit, signal } from '@angular/core';

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
  
  ngOnInit(): void {
    this.updateWelcomeMessage();
  }

  updateWelcomeMessage(): void {
    if (this.isLoggedIn()) {
      this.welcomeMessage.set(`Welcome back, ${this.userName()}!`);
    }
    else {
      this.welcomeMessage.set(`Welcome to Moovies!`);
    }
  }
}
