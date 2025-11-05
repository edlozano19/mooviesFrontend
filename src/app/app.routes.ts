import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { MovieDetailsComponent } from './movies/movie-details/movie-details';
import { Movies } from './movies/movies';
import { Profile } from './profile/profile';
import { Register } from './register/register';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'movies', component: Movies },
    { path: 'movie/:tmdbId', component: MovieDetailsComponent },
    { path: 'profile', component: Profile },
    { path: '**', redirectTo: '/home' }, //Should be not found page in future

];
