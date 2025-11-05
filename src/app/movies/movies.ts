import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MoviesService } from './movies.service';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './movies.html',
  styleUrl: './movies.css'
})

export class Movies implements OnInit {
  searchQuery = signal<string>('');
  isLoading = computed(() => this.moviesService.getIsLoading());
  error = computed(() => this.moviesService.getError());
  movies = computed(() => this.moviesService.getSearchResults());
  currentPage = computed(() => this.moviesService.getCurrentPage());
  totalPages = computed(() => this.moviesService.getTotalPages());
  totalResults = computed(() => this.moviesService.getTotalResults());

  constructor(
    private moviesService: MoviesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const query = params['query'] || '';
      const page = params['page'] ? +params['page'] : 1;

      if (query) {
        this.searchQuery.set(query);
        this.searchMovies(query, page);
      }
    });
  }

  searchMovies(query: string, page: number = 1): void {
    if (!query.trim()) return;

    this.moviesService.searchMovies(query, page).subscribe();
  }

  onSearch(): void {
    const query = this.searchQuery();
    if(query.trim()) {
      this.router.navigate(['/movies'], {
        queryParams: { query: query, page: 1 }
      });
    }
  }

  goToPage(page: number): void {
    const query = this.searchQuery();
    this.router.navigate(['/movies'], {
      queryParams: { query: query, page: page }
    });
  }

  previousPage(): void {
    const current = this.currentPage();
    if (current > 1) {
      this.goToPage(current - 1);
    }
  }

  nextPage(): void {
    const current = this.currentPage();
    const total = this.totalPages();
    if (current < total) {
      this.goToPage(current + 1);
    }
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

  getPageNumbers(): number[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];

    pages.push(1);

    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (total > 1 && !pages.includes(total)) {
      pages.push(total);
    }

    return pages.sort((a, b) => a - b);
  }

  shouldShowEllipsis(index: number): boolean {
    const pages = this.getPageNumbers();
    if (index === 0) return false;
    return pages[index] - pages[index - 1] > 1;
  }
}

