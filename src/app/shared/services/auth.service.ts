import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, user, UserCredential } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private afAuth: Auth, private FirestoreService: FirestoreService) {
    this.user$ = user(afAuth);
  }
  
  isAuthenticated(): boolean {
    return !!this.afAuth.currentUser
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
      return Promise.resolve()
    } catch (error: any) {
      return Promise.reject(error.message);
    }
  }
}
