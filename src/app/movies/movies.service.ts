import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Observable, catchError, of, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { MovieDetails, TMDBMovie, TMDBSearchResponse } from "./movie.interface";

@Injectable({
    providedIn: 'root'
})

export class MoviesService {
    private apiUrl = environment.apiUrl;

    private searchResults = signal<TMDBMovie[]>([]);
    private searchQuery = signal<string>('');
    private currentPage = signal<number>(1);
    private totalPages = signal<number>(1);
    private totalResults = signal<number>(0);
    private isLoading = signal<boolean>(false);
    private error = signal<string | null>(null);

    constructor(private http: HttpClient) {}

    getSearchResults() { return this.searchResults(); }
    getSearchQuery() { return this.searchQuery(); }
    getCurrentPage() { return this.currentPage(); }
    getTotalPages() { return this.totalPages(); }
    getTotalResults() { return this.totalResults(); }
    getIsLoading() { return this.isLoading(); }
    getError() { return this.error(); }

    searchMovies(query: string, page: number = 1): Observable<TMDBSearchResponse> {
        this.isLoading.set(true);
        this.error.set(null);

        const params = new HttpParams()
            .set('query', query)
            .set('page', page.toString());

        return this.http.get<TMDBSearchResponse>(`${this.apiUrl}/movies/search`, { params })
            .pipe(
                tap(( response: TMDBSearchResponse) => {
                    this.searchResults.set(response.results);
                    this.searchQuery.set(query);
                    this.currentPage.set(response.page);
                    this.totalPages.set(response.total_pages);
                    this.totalResults.set(response.total_results);
                    this.isLoading.set(false);
                }),
                catchError((error: HttpErrorResponse) => {
                    this.isLoading.set(false);
                    let errorMessage = 'Failed to search movies';

                    if (error.status === 0) {
                        errorMessage = 'Cannot connect to the server';
                    }
                    else if (error.error?.message) {
                        errorMessage = error.error.message;
                    }

                    this.error.set(errorMessage);
                    return of({
                        page: 1,
                        results: [],
                        total_pages: 0,
                        total_results: 0
                    });
                })
            );
    }

    getMovieDetails(tmdbId: number): Observable<MovieDetails | null> {
        return this.http.get<MovieDetails>(`${this.apiUrl}/movies/tmdb/${tmdbId}`)
            .pipe(
                catchError(( error: HttpErrorResponse) => {
                    console.error('Error fetching movie details:', error);
                    return of(null);
                })
            );
    }

    clearSearch(): void {
        this.searchResults.set([]);
        this.searchQuery.set('');
        this.currentPage.set(1);
        this.totalPages.set(1);
        this.totalResults.set(0);
        this.error.set(null);
    }

    clearError(): void {
        this.error.set(null);
    }
}