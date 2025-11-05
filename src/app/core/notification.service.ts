import { Injectable, signal } from "@angular/core";

export interface Notification {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
    providedIn: 'root'
})

export class NotificationService {
    private notifications = signal<Notification[]>([]);
    private nextId = 0;

    getNotifications() {
        return this.notifications();
    }

    show(message: string, type:Notification['type'] = 'info', duration: number = 3000) : void {
        const notification: Notification = {
            id: this.nextId++,
            message,
            type
        };

        this.notifications.update(notifications => [...notifications, notification]);

        setTimeout(() => {
            this.remove(notification.id);
        }, duration);
    }

    success(message: string, duration?: number): void {
        this.show(message, 'success', duration);
    }

    error(message: string, duration?: number): void {
        this.show(message, 'error', duration);
    }

    info(message: string, duration?: number): void {
        this.show(message, 'info', duration);
    }

    warning(message: string, duration?: number): void {
        this.show(message, 'warning', duration);
    }

    remove(id: number): void {
        this.notifications.update(notifications => 
            notifications.filter(n => n.id !== id));
    }

    clear(): void {
        this.notifications.set([]);
    }
}