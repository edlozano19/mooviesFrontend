import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MovieDetails } from "../movie.interface";
import { MoviesService } from "../movies.service";

@Component({
    selector: 'app-movie-details',
    standalone: true,
    imports: [CommonModule],
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
}