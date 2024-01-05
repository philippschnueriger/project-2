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
import { Observable, BehaviorSubject, map, firstValueFrom } from 'rxjs';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  addDoc,
  query,
  where,
  deleteDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;
  private userDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  userData$: Observable<any> = this.userDataSubject.asObservable();
  private favouritesSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  favourites$: Observable<any> = this.favouritesSubject.asObservable();

  constructor(private afAuth: Auth, private firestore: Firestore) {
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

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map((user) => !!user));
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
      this.userDataSubject.next(null);
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
  async saveFavouriteConnection(uid: string, data: any): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'users', uid);
      const favouritesRef = collection(userRef, 'favourites');
      await addDoc(favouritesRef, data);
      return;
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  async getFavouriteConnections(): Promise<void> {
    try {
      const user = await firstValueFrom(this.user$)// Obtain the user
      if (user) {
        const userRef = doc(this.firestore, 'users', user.uid); // Access uid from the user
        const favouritesRef = collection(userRef, 'favourites');
        const querySnapshot = await getDocs(favouritesRef);
        this.favouritesSubject.next(querySnapshot.docs.map((doc) => doc.data()));
      } else {
        throw new Error('User not authenticated.');
      }
    } catch (error: any) {
      console.error('Error loading favourite connections', error);
      throw error;
    }
  }

  async deleteFavouriteConnection(uid: string, id: string): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'users', uid);
      const favouritesRef = collection(userRef, 'favourites');
      const q = query(favouritesRef, where('id', '==', id));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size > 0) {
        const docId = querySnapshot.docs[0].id;
        const docToDeleteRef = doc(favouritesRef, docId);
        await deleteDoc(docToDeleteRef);
        this.getFavouriteConnections();
      } else {
        console.log('No documents found with the specified ID.');
      }
    } catch (error: any) {
      console.error('Error loading user data', error);
      throw error;
    }
  }

  async saveUserData(uid: string, data: any): Promise<void> {
    try {
      await setDoc(doc(this.firestore, 'users', uid), data);
      return;
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  async getUserData(uid: string): Promise<void> {
    try {
      const docSnap = await getDoc(doc(this.firestore, 'users', uid));
      this.userDataSubject.next(docSnap.data());
    } catch (error: any) {
      console.error('Error loading user data', error);
      throw error;
    }
  }

  async clearData(): Promise<void> {
    try {
      this.userDataSubject.next(null);
    } catch (error: any) {
      console.error('Error logging out', error);
      throw error;
    }
  }
}
