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
import { Storage} from '@angular/fire/storage';

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

  constructor(private afAuth: Auth, private firestore: Firestore, private storage: Storage) {
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

  private handleError(error: any): never {
    console.error('Error:', error);
    throw error;
  }

  private async getUserDocRef(): Promise<DocumentReference | null> {
    try {
      const user = await firstValueFrom(this.user$);
      return user ? doc(this.firestore, 'users', user.uid) : null;
    } catch (error: any) {
      console.error('Error fetching user document reference', error);
      throw error;
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map((user) => !!user));
  }

  async signUp(email: string, password: string): Promise<UserCredential> {
    try {
      return await createUserWithEmailAndPassword(this.afAuth, email, password);
    } catch (error: any) {
      this.handleError(error);
    }
  }
  
  async login(email: string, password: string): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(this.afAuth, email, password);
    } catch (error: any) {
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
    } catch (error: any) {
      console.error('Error saving favourite connection', error);
      throw error;
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
    } catch (error: any) {
      console.error('Error loading favourite connections', error);
      throw error;
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
      const userRef = await this.getUserDocRef();
      if (userRef) {
        await setDoc(userRef, data);
      }
    } catch (error: any) {
      console.error('Error saving user data', error);
      throw error;
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
  } catch (error: any) {
    console.error('Error loading user data', error);
    throw error;
  }
}


async getUserData(): Promise<void> {
  try {
    const userRef = await this.getUserDocRef(); // Fetch user document reference
    if (userRef) {
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
      const userRef = await this.getUserDocRef(); // Fetch user document reference
      if (userRef) {
        const userDoc = await getDoc(userRef);
  
        if (userDoc.exists()) {
          const userData = userDoc.data();
  
          const sharedWith = userData['sharedWith'] || [];
          const sharedFrom = userData['sharedFrom'] || '';
  
          if (!sharedWith.includes(emailToShare)) {
            sharedWith.push(emailToShare);
  
            await updateDoc(userRef, {
              sharedWith: sharedWith,
              sharedFrom: sharedFrom || emailToShare // Update sharedFrom if it's empty
            });
  
            console.log(`Data shared successfully with ${emailToShare}.`);
          } else {
            console.log(`Data is already shared with ${emailToShare}.`);
          }
        } else {
          console.error('User document not found.');
        }
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
  
        const promises: Promise<any[]>[] = [];
  
        for (const userDoc of querySnapshot.docs) {
          const userData = userDoc.data();
  
          if (
            userData['sharedWith'] &&
            userData['sharedWith'].includes(currentUser.email)
          ) {
            const sharedDataRef = collection(
              this.firestore,
              `users/${userDoc.id}/favourites`
            );
            const promise = getDocs(sharedDataRef).then((sharedDataSnapshot) => {
              return sharedDataSnapshot.docs.map((doc) => doc.data());
            });
            promises.push(promise);
          }
        }
  
        const sharedData = await Promise.all(promises);
  
        // Flatten the array of arrays into a single array
        const flattenedSharedData = sharedData.reduce(
          (accumulator, currentValue) => accumulator.concat(currentValue),
          []
        );
  
        console.log('Shared Data:', flattenedSharedData);
      }
    } catch (error: any) {
      console.error('Error loading shared data', error);
      throw error;
    }
  }
  
  async getEmailsOfSharingUsers(): Promise<string[]> {
    try {
      const currentUser = await firstValueFrom(this.user$);
      if (!currentUser) return [];
  
      const allUsersRef = collection(this.firestore, 'users');
      const querySnapshot = await getDocs(allUsersRef);
  
      const sharingUsers: string[] = await Promise.all(
        querySnapshot.docs.map(async (userDoc) => {
          const userData = userDoc.data();
  
          if (
            userData['sharedWith'] &&
            userData['sharedWith'].includes(currentUser.email)
          ) {
            return userData?.['sharedFrom']; // Collect the email of the user sharing data
          }
          return null;
        })
      );
  
      // Filter out null values and return unique email addresses
      const uniqueSharingUsers = Array.from(new Set(sharingUsers.filter(Boolean)));
  
      return uniqueSharingUsers;
    } catch (error: any) {
      console.error('Error loading shared data', error);
      throw error;
    }
  }
  
  async getSharedWithAccounts(): Promise<{ uid: string, email: string }[]> {
    try {
      const currentUser = await firstValueFrom(this.user$);
      if (!currentUser) return [];
  
      const allUsersRef = collection(this.firestore, 'users');
      const querySnapshot = await getDocs(allUsersRef);
  
      const sharedWithAccounts: Promise<{ uid: string, email: string } | null>[] = querySnapshot.docs.map(async (userDoc) => {
        const userData = userDoc.data();
  
        if (userData['sharedWith'] && userData['sharedWith'].includes(currentUser.email)) {
          const email = userData?.['sharedFrom'];
          const uid = userDoc.id;
  
          return { uid, email };
        }
        return null;
      });
  
      const resolvedAccounts = await Promise.all(sharedWithAccounts);
      const filteredAccounts = resolvedAccounts.filter(Boolean) as { uid: string, email: string }[];
  
      return filteredAccounts;
    } catch (error: any) {
      console.error('Error loading shared data', error);
      throw error;
    }
  }
  
  
  async removeCurrentUserFromSharedWith(otherUserUid: string): Promise<void> {
    try {
      const currentUser = await firstValueFrom(this.user$); // Assuming you have a valid user reference
      
      if (currentUser) {
        const otherUsersRef = doc(this.firestore, 'users', otherUserUid);
        const otherUserDoc = await getDoc(otherUsersRef);
      
        if (otherUserDoc.exists()) {
          const userData = otherUserDoc.data();
          const sharedWithEmails = userData['sharedWith'] || [];
  
          const updatedSharedWithEmails = sharedWithEmails.filter((email: string) => email !== currentUser.email);
  
          await updateDoc(otherUsersRef, {
            sharedWith: updatedSharedWithEmails
          });
  
          console.log(`Removed ${currentUser.email} from sharedWith array of user with UID: ${otherUserUid}`);
        } else {
          console.error('User document not found for UID:', otherUserUid);
        }
      } else {
        console.error('Current user not found.');
      }
    } catch (error: any) {
      console.error('Error removing user from sharedWith array', error);
      throw error;
    }
  }
  async getCurrentUserEmail(): Promise<string> {
    try {
      const currentUser = await firstValueFrom(this.user$);
  
      if (currentUser) {
        return currentUser.email || '';
      }
  
      return ''; // Return an empty string if no current user is found
    } catch (error: any) {
      console.error('Error loading shared data', error);
      throw error;
    }
  }
  async getSharedWithForCurrentUser(): Promise<string[]> {
    try {
      const currentUser = await firstValueFrom(this.user$); // Assuming you have a valid user reference
      
      if (currentUser) {
        const userDocRef = doc(this.firestore, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log(userData['sharedWith'])
          return userData['sharedWith'] || [];
        } else {
          console.error('User document not found for current user.');
          return [];
        }
      } else {
        console.error('Current user not found.');
        return [];
      }
    } catch (error: any) {
      console.error('Error retrieving sharedWith data for current user', error);
      throw error;
    }
  }
  async removeEmailFromSharedWith(emailToRemove: string): Promise<void> {
    try {
      const currentUser = await firstValueFrom(this.user$); // Assuming you have a valid user reference
      
      if (currentUser) {
        const userDocRef = doc(this.firestore, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const sharedWithEmails = userData['sharedWith'] || [];
          console.log(sharedWithEmails)
  
          const updatedSharedWithEmails = sharedWithEmails.filter((email: string) => email !== emailToRemove);
          console.log(updatedSharedWithEmails)
  
          await updateDoc(userDocRef, {
            sharedWith: updatedSharedWithEmails
          });
        } else {
          console.error('User document not found for current user.');
        }
      } else {
        console.error('Current user not found.');
      }
    } catch (error: any) {
      console.error('Error removing email from sharedWith array', error);
      throw error;
    }
  }
  async getSharedDataFromUser(userUid: string): Promise<any[]> {
    try {
      const currentUser = await firstValueFrom(this.user$);

      if (currentUser) {
        const sharedData: any[] = [];
        const sharedDataRef = collection(this.firestore, `users/${userUid}/favourites`);
        const sharedDataSnapshot = await getDocs(sharedDataRef);

        sharedDataSnapshot.forEach((doc) => {
          sharedData.push(doc.data());
        });

        console.log('Shared Data:', sharedData);
        return sharedData;
      } else {
        console.error('Current user not found.');
        return [];
      }
    } catch (error: any) {
      console.error('Error loading shared data for user', error);
      throw error;
    }
  }

  async getAllDestinations(): Promise<any> {
    try {
      const destinationsRef = collection(this.firestore, 'destinations');
      const querySnapshot = await getDocs(destinationsRef);
      return querySnapshot.docs.map((doc) => doc.data());
    } catch (error: any) {
      console.error('Error loading destinations', error);
      throw error;
    }
  }

}

