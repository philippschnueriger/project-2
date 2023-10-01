// auth.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true; // User is authenticated, allow access
    } else {
      this.router.navigate(['/login']); // User is not authenticated, redirect to login
      return false; // Block access
    }
  }
}
