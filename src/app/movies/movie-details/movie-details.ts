import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NotificationService } from "../../core/notification.service";
import { StarRatingComponent } from "../components/star-rating/star-rating.component";
import { MovieDetails } from "../movie.interface";
import { MoviesService } from "../movies.service";

@Component({
    selector: 'app-movie-details',
    standalone: true,
    imports: [CommonModule, StarRatingComponent],
    templateUrl: './movie-details.html',
    styleUrl: './movie-details.css'
})

export class MovieDetailsComponent implements OnInit {
    movie = signal<MovieDetails | null>(null);
    isLoading = signal<boolean>(true);
    error = signal<string | null>(null);

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private moviesService: MoviesService,
        private notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const tmdbId = +params['tmdbId'];
            if (tmdbId) {
                this.loadMovieDetails(tmdbId);
            }
            else {
                this.error.set('Invalid movie ID');
                this.isLoading.set(false);
            }
        });
    }

    loadMovieDetails(tmdbId: number): void {
        this.isLoading.set(true);
        this.error.set(null);

        this.moviesService.getMovieDetails(tmdbId).subscribe({
            next: (movie) => {
                if (movie) {
                    this.movie.set(movie);
                }
                else {
                    this.error.set('Movie not found');
                }
                this.isLoading.set(false);
            },
            error: (error) => {
                console.error('Error loading movie:', error);
                this.error.set('Failed to load movie details');
                this.isLoading.set(false);
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/movies']);
    }

    formatRuntime(minutes: number | null): string {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    }

    formatDate(dateString: string | null): string {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getPosterUrl(posterPath: string | null): string {
        if (!posterPath) return 'assets/no-poster.png';

        return `https://image.tmdb.org/t/p/w500${posterPath}`;
    }

    getBackdropUrl(backdropPath: string | null): string {
        if (!backdropPath) return 'assets/no-backdrop.png';

        return `https://image.tmdb.org/t/p/original${backdropPath}`;
    }

    toggleWatchlist(): void {
        const movieData = this.movie();
        if (!movieData) return;

        const tmdbId = movieData.tmdbId;
        const isOnWatchlist = movieData.onWatchList;

        if (isOnWatchlist) {
            this.moviesService.removeFromWatchlist(tmdbId).subscribe({
                next: () => {
                    this.movie.update(m => m ? { ...m, onWatchList: false } : null);
                    this.notificationService.success('Removed from watchlist');
                },
                error: (error) => {
                    console.error('Error removing from watchlist:', error);
                    this.notificationService.error('Failed to remove from watchlist');
                }
            });
        }
        else {
            this.moviesService.addToWatchlist(tmdbId).subscribe({
                next: () => {
                    this.movie.update(m => m ? {... m, onWatchList: true } : null);
                    this.notificationService.success('Added to watchlist');
                },
                error: (error) => {
                    console.error('Error adding to watchlist:', error);
                    this.notificationService.error('Failed to add to watchlist');
                }
            });
        }
    }

    toggleWatchedList(): void {
        const movieData = this.movie();
        if (!movieData) return;

        const tmdbId = movieData.tmdbId;
        const isOnWatchedList = movieData.onWatchedList;

        if (isOnWatchedList) {
            this.moviesService.removeFromWatchedlist(tmdbId).subscribe({
                next: () => {
                    this.movie.update(m => m ? { ...m, onWatchedList: false } : null);
                    this.notificationService.success('Removed from watched list');
                },
                error: (error) => {
                    console.error('Error removing from watched list:', error);
                    this.notificationService.error('Failed to remove from watched list');
                }
            });
        }
        else {
            this.moviesService.addToWatchedlist(tmdbId).subscribe({
                next: () => {
                    this.movie.update(m => m ? { ...m, onWatchedList: true } : null);
                    this.notificationService.success('Added to watched list');
                }
            });
        }
    }

    onRatingChange(newRating: number): void {
        const movieData = this.movie();
        if (!movieData) return;

        this.moviesService.rateMovie(movieData.tmdbId, newRating).subscribe({
            next: (response) => {
                this.movie.update(m => m ? {
                    ...m,
                    userRating: {
                        id: response.id,
                        rating: response.rating,
                        createdAt: response.createdAt,
                        updatedAt: response.updatedAt
                    }
                } : null);
                this.notificationService.success(`Rated ${newRating}/5 stars`);
            },
            error: (error) => {
                console.error('Error rating movie:', error);
                this.notificationService.error('Failed to rate movie');
            }
        });
    }

    deleteRating(): void {
        const movieData = this.movie();
        if (!movieData || !movieData.userRating) return;

        this.moviesService.deleteRating(movieData.id).subscribe({
            next: () => {
                this.movie.update(m => m ? { ...m, userRating: null } : null);
                this.notificationService.success('Rating removed');
            },
            error: (error) => {
                console.error('Error deleting rating:', error);
                this.notificationService.error('Failed to delete rating');
            }
        });
    }
}