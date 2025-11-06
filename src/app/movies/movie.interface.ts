export interface Genre {
    id: number;
    name: string;
}

export interface TMDBMovie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    runtime: number | null;
    genres: Genre[];
    original_title: string;
}

export interface TMDBSearchResponse {
    page: number;
    results: TMDBMovie[];
    total_pages: number;
    total_results: number;
}

export interface MovieSummary {
    id: number;
    tmdbId: number;
    title: string;
    posterPath: string | null;
    releaseDate: string;
    averageRating: number | null;
    voteCount: number | null;
}

export interface UserRating {
    id: number;
    rating: number;
    createdAt: string;
    updatedAt: string;
}

export interface MovieDetails {
    id: number;
    tmdbId: number;
    title: string;
    originalTitle: string | null;
    overview: string;
    posterPath: string | null;
    backdropPath: string | null;
    releaseDate: string;
    runtime: number| null;
    genres: string;
    averageRating: number | null;
    voteCount: number | null;
    userRating: UserRating | null;
    onWatchList: boolean;
    onWatchedList: boolean;
}

export interface RateMovieRequest {
    tmdbId: number;
    rating: number;
}

export interface AddToWatchListRequest {
    tmdbId: number;
}

export interface AddToWatchedListRequest {
    tmdbId: number;
}

export interface WatchedListItem {
    id: number;
    movie: MovieSummary;
    addedAt: string;
    userRating: UserRating | null;
}

export interface WatchListItem {
    id: number;
    movie: MovieSummary;
    addedAt: string;
}

