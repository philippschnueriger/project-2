// auth.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      take(1),
      map((user) => {
        const isAuthenticated = !!user; // Check if the user is logged in
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
        }
        return isAuthenticated; // Return whether the user is authenticated or not
      })
    );
  }
}
