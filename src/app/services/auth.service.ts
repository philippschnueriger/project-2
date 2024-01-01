import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  user,
  UserCredential,
  sendPasswordResetEmail,
  updatePassword,
} from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(
    private afAuth: Auth,
    private FirestoreService: FirestoreService
  ) {
    this.user$ = user(afAuth);
  }

  isAuthenticated(): boolean {
    return !!this.afAuth.currentUser;
  }

  async signUp(email: string, password: string): Promise<UserCredential> {
    return await createUserWithEmailAndPassword(this.afAuth, email, password)
      .then((userCredential) => {
        return Promise.resolve(userCredential);
      })
      .catch((error) => {
        return Promise.reject(error.message);
      });
  }

  async login(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(this.afAuth, email, password)
      .then((userCredential) => {
        return Promise.resolve(userCredential);
      })
      .catch((error) => {
        return Promise.reject(error.message);
      });
  }

  async logout(): Promise<void> {
    try {
      await this.FirestoreService.clearData();
      await this.afAuth.signOut();
      return Promise.resolve();
    } catch (error: any) {
      return Promise.reject(error.message);
    }
  }
  async resetPassword(email: string) {
    return await sendPasswordResetEmail(this.afAuth, email)
      .then(() => {
        console.log('Password reset email sent to:', email);
      })
      .catch((error) => {
        console.error('Error sending password reset email:', error);
      });
  }
  async changePassword(password: string): Promise<any> {
    console.log(password)
    if (!this.afAuth.currentUser) {
      return Promise.reject('No user logged in');
    }
    return await updatePassword(this.afAuth.currentUser, password)
      .then(() => {
        console.log('Password updated');
      })
      .catch((error) => {
        console.error('Error updating password:', error);
      });
  }
}
