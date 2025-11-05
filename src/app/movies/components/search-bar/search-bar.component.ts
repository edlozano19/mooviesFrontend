import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { TMDBMovie } from '../../movie.interface';
import { MoviesService } from '../../movies.service';

@Component({
    selector: 'app-search-bar',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './search-bar.component.html',
    styleUrl: './search-bar.component.css'
})

export class SearchBarComponent implements OnInit {
    searchQuery = signal<string>('');
    searchResults = signal<TMDBMovie[]>([]);
    isSearching = signal<boolean>(false);
    showDropdown = signal<boolean>(false);

    private searchSubject = new Subject<string>();

    constructor(
        private MovieService: MoviesService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(query => {
                if (query.trim().length < 2) {
                    this.searchResults.set([]);
                    this.showDropdown.set(false);
                    return [];
                }

                this.isSearching.set(true);
                return this.MovieService.searchMovies(query, 1);
            })
        ).subscribe(response => {
            this.isSearching.set(false);
            if (response && response.results) {
                this.searchResults.set(response.results.slice(0, 5));
                this.showDropdown.set(true);
            }
        });
    }

    onSearchInput(event: Event): void {
        const query = (event.target as HTMLInputElement).value;
        this.searchQuery.set(query);
        this.searchSubject.next(query);
    }

    onSearchSubmit(): void {
        const query = this.searchQuery();
        if (query.trim()) {
            this.hideDropdown();
            this.router.navigate(['/movies'], { queryParams: { query: query }});
        }
    }

    onMovieClick(): void {
        this.hideDropdown();
        this.searchQuery.set('');
    }

    hideDropdown(): void {
        this.showDropdown.set(false);
    }

    getPosterUrl(posterPath: string | null): string {
        if (!posterPath) return 'assets/images/no-poster.png';
        return `https://image.tmdb.org/t/p/w500${posterPath}`;
    }

    formatDate(dateString: string): string {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.getFullYear().toString();
    }

    onBlur(): void {
        setTimeout(() => this.hideDropdown(), 200);
    }
}