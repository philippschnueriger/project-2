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
  async saveFavouriteConnection(data: any): Promise<void> {
    try {
      const user = await firstValueFrom(this.user$);
      if (user) {
        const userRef = doc(this.firestore, 'users', user.uid);
        const favouritesRef = collection(userRef, 'favourites');
        await addDoc(favouritesRef, data);
      }
    } catch (error: any) {
      console.error('Error saving favourite connection', error);
      throw error;
    }
  }

  async getFavouriteConnections(): Promise<void> {
    try {
      const user = await firstValueFrom(this.user$);
      if (user) {
        const userRef = doc(this.firestore, 'users', user.uid);
        const favouritesRef = collection(userRef, 'favourites');
        const querySnapshot = await getDocs(favouritesRef);
        this.favouritesSubject.next(
          querySnapshot.docs.map((doc) => doc.data())
        );
      }
    } catch (error: any) {
      console.error('Error loading favourite connections', error);
      throw error;
    }
  }

  async deleteFavouriteConnection(id: string): Promise<void> {
    try {
      const user = await firstValueFrom(this.user$);
      if (user) {
        const userRef = doc(this.firestore, 'users', user.uid);
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
    } catch (error: any) {
      console.error('Error deleting favourite connection', error);
      throw error;
    }
  }

  async saveUserData(data: any): Promise<void> {
    try {
      const user = await firstValueFrom(this.user$);
      if (user) {
        const userRef = doc(this.firestore, 'users', user.uid);
        await setDoc(userRef, data);
      }
    } catch (error: any) {
      console.error('Error saving user data', error);
      throw error;
    }
  }
  async saveUserPreferences(data: any): Promise<void> {
    try {
      const user = await firstValueFrom(this.user$);
      if (user) {
        const userRef = doc(this.firestore, 'users', user.uid);
        await setDoc(userRef, data);
      }
    } catch (error: any) {
      console.error('Error saving user data', error);
      throw error;
    }
  }

  async getUserPreferences(): Promise<any> {
    try {
      const user = await firstValueFrom(this.user$);
      if (user) {
        const userRef = doc(this.firestore, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        return docSnap.data();
        //this.userPreferencesSubject.next(docSnap.data());
      }
    } catch (error: any) {
      console.error('Error loading user data', error);
      throw error;
    }
  }

  async getUserData(): Promise<void> {
    try {
      const user = await firstValueFrom(this.user$);
      if (user) {
        const userRef = doc(this.firestore, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        this.userDataSubject.next(docSnap.data());
      }
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

  async shareFavourites(emailToShare: string): Promise<void> {
    try {
      const currentUser = await firstValueFrom(this.user$);
      
      if (currentUser) {
        const usersRef = doc(this.firestore, 'users', currentUser.uid);
        const userDoc = await getDoc(usersRef);
  
        // Check if the current user document exists
        if (userDoc.exists()) {
          const userData = userDoc.data();
  
          // Assuming 'sharedWith' is an array field in the user document
          const sharedWith = userData['sharedWith'] || [];
          
          // Check if the emailToShare isn't already in the 'sharedWith' array
          if (!sharedWith.includes(emailToShare)) {
            sharedWith.push(emailToShare);
  
            // Update the 'sharedWith' array in Firestore
            await updateDoc(usersRef, {
              sharedWith: sharedWith
            });
  
            console.log(`Data shared successfully with ${emailToShare}.`);
          } else {
            console.log(`Data is already shared with ${emailToShare}.`);
          }
        } else {
          console.error('User document not found.');
        }
      } else {
        console.error('Current user not found.');
      }
    } catch (error: any) {
      console.error('Error sharing user data', error);
      throw error;
    }
  }
  async getSharedData(): Promise<void> {
    try {
      const currentUser = await firstValueFrom(this.user$);
  
      if (currentUser) {
        const allUsersRef = collection(this.firestore, 'users');
        const querySnapshot = await getDocs(allUsersRef);
        
        const sharedData: any[] = [];
  
        for (const userDoc of querySnapshot.docs) {
          const userData = userDoc.data();
  
          if (
            userData['sharedWith'] &&
            userData['sharedWith'].includes(currentUser?.email)
          ) {
            const sharedDataRef = collection(
              this.firestore,
              `users/${userDoc.id}/favourites`
            );
            const sharedDataSnapshot = await getDocs(sharedDataRef);
  
            sharedDataSnapshot.forEach((doc) => {
              sharedData.push(doc.data());
            });
          }
        }
  
        console.log('Shared Data:', sharedData);
      }
    } catch (error: any) {
      console.error('Error loading shared data', error);
      throw error;
    }
  }
}
