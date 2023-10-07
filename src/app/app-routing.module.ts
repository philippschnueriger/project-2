import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './shared/auth.guard';
import { ResultsComponent } from './components/search-results/search-results.component';


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
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    title: 'Profile',
    canActivate: [AuthGuard] 
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

