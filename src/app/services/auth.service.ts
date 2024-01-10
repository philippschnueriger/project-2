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
  updateDoc,
  DocumentReference,
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

  private async getUserDocRef(): Promise<DocumentReference | null> {
    try {
      const user = await firstValueFrom(this.user$);
      return user ? doc(this.firestore, 'users', user.uid) : null;
    } catch (error) {
      this.handleError(error);
    }
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
    try {
      return await signInWithEmailAndPassword(this.afAuth, email, password);
    } catch (error) {
      this.handleError(error);
    }
  }
  
  async logout(): Promise<void> {
    try {
      this.userDataSubject.next(null);
      await this.afAuth.signOut();
    } catch (error) {
      return this.handleError(error);
    }
  }
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.afAuth, email);
      console.log('Password reset email sent to:', email);
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
      console.log('Password updated');
    } catch (error) {
      this.handleError(error);
    }
  }
  
  async saveFavouriteConnection(data: any): Promise<void> {
    try {
      const userRef = await this.getUserDocRef();
      if (userRef) {
        const favouritesRef = collection(userRef, 'favourites');
        await addDoc(favouritesRef, data);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async getFavouriteConnections(): Promise<void> {
    try {
      const userRef = await this.getUserDocRef();
      if (userRef) {
        const favouritesRef = collection(userRef, 'favourites');
        const querySnapshot = await getDocs(favouritesRef);
        this.favouritesSubject.next(
          querySnapshot.docs.map((doc) => doc.data())
        );
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteFavouriteConnection(id: string): Promise<void> {
    try {
      const userRef = await this.getUserDocRef();
      if (userRef) {
        const favouritesRef = collection(userRef, 'favourites');
        const q = query(favouritesRef, where('id', '==', id));
        const querySnapshot = await getDocs(q);
  
        if (querySnapshot.size > 0) {
          const docId = querySnapshot.docs[0].id;
          const docToDeleteRef = doc(favouritesRef, docId);
          await deleteDoc(docToDeleteRef);
          await this.getFavouriteConnections();
        } else {
          console.log('No documents found with the specified ID.');
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async saveUserData(data: any): Promise<void> {
    try {
      const user = await firstValueFrom(this.user$);
      if (user) {
        const userRef = doc(this.firestore, 'users', user.uid);
        await setDoc(userRef, data);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async saveUserPreferences(data: any): Promise<void> {
    try {
      const userRef = await this.getUserDocRef();
      if (userRef) {
        await setDoc(userRef, data);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

async getUserPreferences(): Promise<any> {
  try {
    const userRef = await this.getUserDocRef();
    if (userRef) {
      const docSnap = await getDoc(userRef);
      return docSnap.data();
    }
    return null;
  } catch (error) {
    this.handleError(error);
  }
}


async getUserData(): Promise<void> {
  try {
    const userRef = await this.getUserDocRef(); // Fetch user document reference
    if (userRef) {
      const docSnap = await getDoc(userRef);
      this.userDataSubject.next(docSnap.data());
    }
  } catch (error) {
    this.handleError(error);
  }
}


  async clearData(): Promise<void> {
    try {
      this.userDataSubject.next(null);
    } catch (error) {
      this.handleError(error);
    }
  }

  

  async getAllDestinations(): Promise<any> {
    try {
      const destinationsRef = collection(this.firestore, 'destinations');
      const querySnapshot = await getDocs(destinationsRef);
      return querySnapshot.docs.map((doc) => doc.data());
    } catch (error) {
      this.handleError(error);
    }
  }

}

