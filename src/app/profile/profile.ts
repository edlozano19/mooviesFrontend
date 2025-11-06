import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth, User } from '../core/auth';
import { WatchedListItem, WatchListItem } from '../movies/movie.interface';
import { MoviesService } from '../movies/movies.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  currentUser = signal<User | undefined>(undefined);
  watchedMovies = signal<WatchedListItem[]>([]);
  watchlistMovies = signal<WatchListItem[]>([]);
  isLoadingWatched = signal<boolean>(true);
  isLoadingWatchlist = signal<boolean>(true);

  recentWatchedMovies = computed(() => {
    return this.watchedMovies()
      .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
      .slice(0, 10);
  });

  recentWatchlistMovies = computed(() => {
    return this.watchlistMovies()
      .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
      .slice(0, 10);
  })

  constructor(
    private authService: Auth,
    private moviesService: MoviesService,
  ) {}

  ngOnInit(): void {
    this.currentUser.set(this.authService.getCurrentUser());
    
    this.moviesService.getWatchedList().subscribe({
      next: (movies) => {
        this.watchedMovies.set(movies);
        this.isLoadingWatched.set(false);
      },
      error: (error) => {
        console.error('Error fetching watched list:', error);
        this.isLoadingWatched.set(false);
      }
    });

    this.moviesService.getWatchList().subscribe({
      next: (movies) => {
        this.watchlistMovies.set(movies);
        this.isLoadingWatchlist.set(false);
      },
      error: (error) => {
        console.error('Error fetching watchlist:', error);
        this.isLoadingWatchlist.set(false);
      }
    });
  }

  getPosterUrl(posterPath: string | null): string {
    if(!posterPath) return '/assets/images/default-poster.jpg';
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  }

  getInitials(firstName?: string, lastName?: string): string {
    const first = firstName?.charAt(0).toUpperCase() || '';
    const last = lastName?.charAt(0).toUpperCase() || '';
    return first + last || '?';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  scrollLeft(containerId: string): void {
    const container = document.getElementById(containerId);
    if (container) {
      container.scrollBy({ left: -400, behavior: 'smooth' });
    }
  }

  scrollRight(containerId: string): void {
    const container = document.getElementById(containerId);
    if (container) {
      container.scrollBy({ left: 400, behavior: 'smooth' });
    }
  }
}
