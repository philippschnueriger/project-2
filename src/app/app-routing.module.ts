import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/views/login/login.component';
import { HomeComponent } from './components/views/home/home.component';
import { AuthGuard } from './services/auth.guard';
import { ResultsComponent } from './components/views/search-results/search-results.component';
import { FavouritesComponent } from './components/views/favourites/favourites.component';
import { DestinationExplorerComponent } from './components/views/destination-explorer/destination-explorer.component';
import { AccountComponent } from './components/views/account/account.component';
import { SharedFavouritesComponent } from './components/views/shared-favourites/shared-favourites.component';


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
    component: DestinationExplorerComponent,
    title: 'Destinations'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'signup',
    component: LoginComponent,
    title: 'Signup'
  },
  {
    path: 'reset-password',
    component: LoginComponent,
    title: 'Reset password'
  },
  {
    path: 'account',
    component: AccountComponent,
    title: 'Account',
    canActivate: [AuthGuard] 
  },
  {
    path: 'favourites',
    component: FavouritesComponent,
    title: 'Favourites',
    canActivate: [AuthGuard] 
  },
  {
    path: 'shared-favourites',
    component: SharedFavouritesComponent,
    title: 'Shared Favourites',
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

