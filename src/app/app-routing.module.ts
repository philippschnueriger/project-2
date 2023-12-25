import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/views/login/login.component';
import { UserProfileComponent } from './components/views/user-profile/user-profile.component';
import { HomeComponent } from './components/views/home/home.component';
import { AuthGuard } from './services/auth.guard';
import { ResultsComponent } from './components/views/search-results/search-results.component';
import { FavouriteConnectionsComponent } from './components/views/favourite-connections/favourite-connections.component';
import { DestinationsComponent } from './components/views/destinations/destinations.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home'
  },
  {
    path: 'results',
    component: ResultsComponent,
    title: 'Results'
  },
  {
    path: 'destinations',
    component: DestinationsComponent,
    title: 'Destinations'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    title: 'Profile',
    canActivate: [AuthGuard] 
  },
  {
    path: 'favourites',
    component: FavouriteConnectionsComponent,
    title: 'Favorites',
    canActivate: [AuthGuard] 
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

