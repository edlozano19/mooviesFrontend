import { CommonModule } from "@angular/common";
import { Component, computed } from "@angular/core";
import { NotificationService } from "./notification.service";

@Component({
    selector: 'app-notifications',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="notification-container">
            @for (notification of notifications(); track notification.id) {
                <div
                    class="notification notification-{{ notification.type }}">
                    <span class="notification-message"> {{ notification.message }}</span>
                    <button
                        class="notification-close"
                        (click)="close(notification.id)"
                        aria-label="Close">
                        ×
                    </button>
                </div>
            }
        </div>
    `,
  styles: [`
    .notification-container {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 400px;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }

    .notification {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease-out;
      font-size: 14px;
      font-weight: 500;
    }

    @keyframes slideIn {
      from {
        transform: translateY(-100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .notification-success {
      background-color: #10b981;
      color: white;
    }

    .notification-error {
      background-color: #ef4444;
      color: white;
    }

    .notification-info {
      background-color: #3b82f6;
      color: white;
    }

    .notification-warning {
      background-color: #f59e0b;
      color: white;
    }

    .notification-message {
      flex: 1;
      margin-right: 12px;
    }

    .notification-close {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.8;
      transition: opacity 0.2s;
    }

    .notification-close:hover {
      opacity: 1;
    }
  `]
})

export class NotificationComponent {
    notifications = computed(() => this.notificationService.getNotifications());

    constructor(private notificationService: NotificationService) {}

    close(id: number): void {
        this.notificationService.remove(id);
    }
}