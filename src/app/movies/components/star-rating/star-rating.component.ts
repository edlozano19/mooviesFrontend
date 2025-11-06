import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
    selector: 'app-star-rating',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './star-rating.component.html',
    styleUrl: './star-rating.component.css'
})

export class StarRatingComponent {
    @Input() rating = 0;
    @Input() readonly = false;
    @Input() size: 'small' | 'medium' | 'large' = 'medium';
    @Output() ratingChange = new EventEmitter<number>();

    hoveredRating = signal<number>(0);

    get stars(): number[] {
        return [1, 2, 3, 4, 5];
    }

    getStarFill(starIndex: number): number {
        const rating = this.hoveredRating() || this.rating;
        const starValue = starIndex;

        if (rating >= starValue) {
            return 100;
        }
        else if (rating >= starValue - 1) {
            const decimal = rating - (starValue - 1);
            return decimal * 100;
        }
        return 0;
    }

    onStarHover(starIndex: number, event: MouseEvent): void {
        if (this.readonly) return;

        const starElement = event.currentTarget as HTMLElement;
        const rect = starElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const width = rect.width;
        const percentage = x / width;

        let rating: number;
        if (percentage < 0.25) {
            rating = starIndex - 0.75;
        }
        else if (percentage < 0.5) {
            rating = starIndex - 0.5;
        }
        else if (percentage < 0.75) {
            rating = starIndex - 0.25;
        }
        else {
            rating = starIndex;
        }

        this.hoveredRating.set(rating);
    }

    onStarClick(starIndex: number, event: MouseEvent): void {
        console.log('Star clicked:', starIndex);
        if (this.readonly) return;

        const starElement = event.currentTarget as HTMLElement;
        const rect = starElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const width = rect.width;
        const percentage = x / width;

        let rating: number;
        if (percentage < 0.25) {
            rating = starIndex - 0.75;
        }
        else if (percentage < 0.5) {
            rating = starIndex - 0.5;
        }
        else if (percentage < 0.75) {
            rating = starIndex - 0.25;
        }
        else {
            rating = starIndex;
        }

        this.ratingChange.emit(rating);
    }

    onMouseLeave(): void {
        this.hoveredRating.set(0);
    }
}