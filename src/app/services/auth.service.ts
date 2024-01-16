import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  UserCredential,
  sendPasswordResetEmail,
  updatePassword,
} from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { Observable, map, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private afAuth: Auth) {
    this.user$ = new Observable((observer) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user) {
          observer.next(user);
        } else {
          observer.next(null);
        }
      });
    });
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      return await firstValueFrom(this.user$);
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    console.error('Error:', error);
    throw error;
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map((user) => !!user));
  }

  async signUp(email: string, password: string): Promise<UserCredential> {
    try {
      return await createUserWithEmailAndPassword(this.afAuth, email, password);
    } catch (error) {
      this.handleError(error);
    }
  }
  
  async login(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(this.afAuth, email, password);
  }
  
  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      return this.handleError(error);
    }
  }
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.afAuth, email);
    } catch (error) {
      this.handleError(error);
    }
  }
  
  async changePassword(password: string): Promise<void> {
    try {
      if (!this.afAuth.currentUser) {
        throw new Error('No user logged in');
      }
      await updatePassword(this.afAuth.currentUser, password);
    } catch (error) {
      this.handleError(error);
    }
  }
}

