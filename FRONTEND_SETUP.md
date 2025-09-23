# Moovies Frontend Setup Guide

## 🎯 **Project Overview**
This is the frontend setup reference for the **Moovies** application - a movie cataloging and management system built with Angular and Node.js, connecting to a Spring Boot backend.

## 📋 **Current Setup Status**
✅ **Completed:**
- Node.js installed
- npm installed  
- Angular CLI installed
- Angular project created (`mooviesFrontend`)

## 🏗️ **Project Structure**
```
C:\Moovies\
├── mooviesBackend\     (Spring Boot API)
└── mooviesFrontend\    (Angular Frontend - Current Project)
    ├── src/
    │   ├── app/
    │   │   ├── app.config.ts
    │   │   ├── app.css
    │   │   ├── app.html
    │   │   ├── app.routes.ts
    │   │   └── app.ts
    │   ├── index.html
    │   ├── main.ts
    │   └── styles.css
    ├── angular.json
    ├── package.json
    └── tsconfig.json
```

## 🚀 **Prerequisites Verification**

### **Node.js & npm**
```bash
node --version    # Should show v18.x or v20.x (LTS)
npm --version     # Should show 9.x or 10.x
```

### **Angular CLI**
```bash
ng version        # Should show Angular CLI 17.x+
```

## 📦 **Recommended Dependencies for Movie App**

### **UI Framework Options**
1. **Angular Material** (Recommended for movie app)
   ```bash
   ng add @angular/material
   ```
   - Pre-built components (cards, dialogs, navigation)
   - Material Design principles
   - Great for movie cards and layouts

2. **Bootstrap** (Alternative)
   ```bash
   npm install bootstrap
   ```

3. **PrimeNG** (Rich component library)
   ```bash
   npm install primeng primeicons
   ```

### **Essential Dependencies**
```bash
# HTTP Client (built into Angular)
# Already available: @angular/common/http

# State Management (for complex app state)
ng add @ngrx/store

# Forms (built into Angular)
# Already available: @angular/forms

# Animations
npm install @angular/animations

# Date handling
npm install date-fns

# Image lazy loading
npm install ng-lazyload-image
```

### **Development Tools**
```bash
# Linting
ng add @angular-eslint/schematics

# Code formatting
npm install --save-dev prettier

# Git hooks
npm install --save-dev husky

# Environment management
npm install --save-dev dotenv
```

## 🏗️ **Recommended Project Architecture**

### **Folder Structure for Movie App**
```
src/app/
├── core/                    (Singleton services, guards)
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── role.guard.ts
│   ├── interceptors/
│   │   ├── auth.interceptor.ts
│   │   └── error.interceptor.ts
│   └── services/
│       ├── auth.service.ts
│       └── notification.service.ts
├── shared/                  (Reusable components)
│   ├── components/
│   │   ├── movie-card/
│   │   ├── loading-spinner/
│   │   ├── search-bar/
│   │   └── rating-stars/
│   ├── pipes/
│   │   ├── duration.pipe.ts
│   │   └── genre.pipe.ts
│   └── models/
│       ├── movie.interface.ts
│       ├── user.interface.ts
│       └── api-response.interface.ts
├── features/                (Feature modules)
│   ├── auth/
│   │   ├── login/
│   │   ├── register/
│   │   └── auth.module.ts
│   ├── movies/
│   │   ├── movie-list/
│   │   ├── movie-detail/
│   │   ├── movie-search/
│   │   └── movies.module.ts
│   ├── user-profile/
│   │   ├── profile/
│   │   ├── settings/
│   │   └── user-profile.module.ts
│   └── dashboard/
│       ├── dashboard/
│       └── dashboard.module.ts
├── layouts/                 (App layouts)
│   ├── main-layout/
│   └── auth-layout/
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

## 🌐 **Backend Integration Setup**

### **Environment Configuration**
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081/api',  // Your Spring Boot backend
  tmdbApiUrl: 'https://api.themoviedb.org/3',
  tmdbApiKey: 'your-tmdb-api-key-here',
  tmdbImageBaseUrl: 'https://image.tmdb.org/t/p/w500'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-domain.com/api',
  tmdbApiUrl: 'https://api.themoviedb.org/3',
  tmdbApiKey: 'your-tmdb-api-key-here',
  tmdbImageBaseUrl: 'https://image.tmdb.org/t/p/w500'
};
```

### **HTTP Services Structure**
```typescript
// Core services to implement:
- AuthService          (login, register, JWT token management)
- UserService          (user CRUD operations)
- MovieService         (TMDB API integration)
- WatchlistService     (user's movie lists)
- NotificationService  (alerts, toasts, error handling)
```

## 🎨 **UI/UX Planning for Movie App**

### **Key Components Needed**
1. **Movie Card Component**
   - Movie poster
   - Title, year, rating
   - Quick actions (add to watchlist, favorite)

2. **Movie Detail Component**
   - Full movie information
   - Cast and crew
   - Trailers and images
   - User reviews

3. **Search Component**
   - Advanced search filters
   - Genre filtering
   - Year range
   - Rating filters

4. **User Dashboard**
   - Recently watched
   - Watchlist
   - Favorites
   - Recommendations

### **Responsive Design**
- Mobile-first approach
- Movie grid layouts
- Touch-friendly interactions
- Optimized image loading

### **Theme Considerations**
- Dark mode (popular for movie apps)
- Cinema-inspired color palette
- High contrast for readability
- Smooth animations and transitions

## 📱 **Additional Features to Consider**

### **Progressive Web App (PWA)**
```bash
ng add @angular/pwa
```
- Offline movie browsing
- App-like experience
- Push notifications for new releases

### **Performance Optimizations**
- Lazy loading for routes
- Image optimization and lazy loading
- Virtual scrolling for large movie lists
- OnPush change detection strategy

## 🔧 **Development Workflow**

### **Package.json Scripts**
```json
{
  "scripts": {
    "start": "ng serve",
    "start:dev": "ng serve --configuration development --open",
    "build": "ng build",
    "build:prod": "ng build --configuration production",
    "test": "ng test",
    "test:coverage": "ng test --code-coverage",
    "lint": "ng lint",
    "lint:fix": "ng lint --fix",
    "e2e": "ng e2e"
  }
}
```

### **Development Commands**
```bash
# Start development server
npm start

# Run with specific port
ng serve --port 4201

# Build for production
npm run build:prod

# Run tests
npm test

# Lint code
npm run lint
```

## 🚀 **Next Development Steps**

### **Phase 1: Foundation**
1. Set up routing structure
2. Create shared components (header, footer, navigation)
3. Implement authentication flow
4. Connect to Spring Boot backend

### **Phase 2: Core Features**
1. Movie search and display
2. User registration and login
3. Movie details page
4. Basic user profile

### **Phase 3: Advanced Features**
1. Watchlist and favorites
2. Movie recommendations
3. User reviews and ratings
4. Social features

### **Phase 4: Polish**
1. Performance optimization
2. PWA features
3. Advanced search filters
4. Admin panel (if needed)

## 🔗 **API Integration Points**

### **Your Spring Boot Backend**
- User authentication: `POST /api/auth/login`
- User registration: `POST /api/auth/register`
- User profile: `GET /api/users/{id}`
- User watchlist: `GET /api/users/{id}/watchlist`

### **TMDB API Integration**
- Movie search: `GET /search/movie`
- Movie details: `GET /movie/{id}`
- Popular movies: `GET /movie/popular`
- Movie genres: `GET /genre/movie/list`

## 🛠️ **VS Code Extensions (Recommended)**
- Angular Language Service
- Angular Snippets (by John Papa)
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

## 📚 **Useful Resources**
- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [Angular Style Guide](https://angular.io/guide/styleguide)

## 🤔 **Decisions to Make**
1. **UI Framework**: Angular Material vs Bootstrap vs PrimeNG
2. **State Management**: Services vs NgRx (recommended for complex state)
3. **Testing Strategy**: Unit tests, E2E tests, coverage targets
4. **Deployment**: Netlify, Vercel, AWS S3, or other hosting

---

**Current Status**: ✅ Basic Angular project setup complete
**Next Step**: Choose UI framework and start implementing core components
