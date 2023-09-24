import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, user, UserCredential } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { Observable, from } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private afAuth: Auth) {
    this.user$ = user(afAuth);
  }

  signUp(email: string, password: string): Observable<UserCredential> {
    return from(
      createUserWithEmailAndPassword(this.afAuth, email, password)
    ).pipe(
      catchError((error) => {
        console.error('Sign Up Error:', error);
        throw error;
      })
    );
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(
      signInWithEmailAndPassword(this.afAuth, email, password)
    ).pipe(
      catchError((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Login Error:', errorCode, errorMessage);
        throw error;
      })
    );
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut()).pipe(
      catchError((error) => {
        console.error('Logout Error:', error);
        throw error;
      })
    );
  }
}
