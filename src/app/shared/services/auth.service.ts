import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, user, UserCredential } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { FirestoreService } from './firestore.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private afAuth: Auth, private FirestoreService: FirestoreService) {
    this.user$ = user(afAuth);
  }
  
  isAuthenticated(): boolean {
    return !!this.afAuth.currentUser
  }

  async signUp(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.afAuth, email, password)
      .then((userCredential) => {
        return Promise.resolve(userCredential);
      })
      .catch((error) => {
        return Promise.reject(error.message);
      });
  }

  async login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.afAuth, email, password)
      .then((userCredential) => {
        return Promise.resolve(userCredential);
      })
      .catch((error) => {
        return Promise.reject(error.message);
      });
  }

  async logout(): Promise<void> {
    try {
      this.FirestoreService.clearData();
      await this.afAuth.signOut();
      return Promise.resolve()
      
    } catch (error: any) {
      return Promise.reject(error.message);
    }
  }
}
