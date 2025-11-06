import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { catchError, Observable, of, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { MovieDetails, TMDBMovie, TMDBSearchResponse, WatchedListItem, WatchListItem } from "./movie.interface";

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

    addToWatchlist(tmdbId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/movies/watchlist`, { tmdbId })
            .pipe(
                catchError(( error: HttpErrorResponse) => {
                    console.error('Error adding to watchlist:', error);
                    throw error;
                })
            );
    }

    removeFromWatchlist(tmdbId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/movies/watchlist/${tmdbId}`)
            .pipe(
                catchError(( error: HttpErrorResponse ) => {
                    console.error('Error removing from watchlist:', error);
                    throw error;
                })
            );
    }

    addToWatchedlist(tmdbId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/movies/watched`, { tmdbId })
            .pipe(
                catchError(( error: HttpErrorResponse ) => {
                    console.error('Error adding to watched list:', error);
                    throw error;
                }) 
            );
    }

    removeFromWatchedlist(tmdbId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/movies/watched/${tmdbId}`)
            .pipe(
                catchError(( error: HttpErrorResponse ) => {
                    console.error('Error removing from watched list:', error)
                    throw error;
                })
            );
    }

    rateMovie(tmdbId: number, rating: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/movies/rate`, { tmdbId, rating })
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    console.error('Error rating movie:', error);
                    throw error;
                })
            );
    }

    deleteRating(movieId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/movies/${movieId}/rating`)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    console.error('Error deleting rating', error);
                    throw error;
                })
            );
    }

    getWatchedList(): Observable<WatchedListItem[]> {
        return this.http.get<WatchedListItem[]>(`${this.apiUrl}/movies/watched`)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    console.error('Error fetching watched list:', error);
                    throw error;
                })
            );
    }

    getWatchList(): Observable<WatchListItem[]> {
        return this.http.get<WatchListItem[]>(`${this.apiUrl}/movies/watchlist`)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    console.error('Error fetching watchlist:', error);
                    throw error;
                })
            );
    }
}