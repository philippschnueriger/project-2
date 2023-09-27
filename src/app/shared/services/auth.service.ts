import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, user, UserCredential } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { Observable, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FirestoreService } from './firestore.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private afAuth: Auth, private FirestoreService: FirestoreService) {
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

  async login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.afAuth, email, password)
      .then((userCredential) => {
        return Promise.resolve(userCredential);
      })
      .catch((error) => {
        return Promise.reject(error.message);
      });
  }

  logout(): Observable<void> {
    this.FirestoreService.clearData();
    return from(this.afAuth.signOut()).pipe(
      catchError((error) => {
        console.error('Logout Error:', error);
        throw error;
      })
    );
  }
}
