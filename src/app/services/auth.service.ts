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
import { Storage, getDownloadURL, ref } from '@angular/fire/storage';

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
          const sharedFrom = userData['sharedFrom'] || '';
          
          // Check if the emailToShare isn't already in the 'sharedWith' array
          if (!sharedWith.includes(emailToShare)) {
            sharedWith.push(emailToShare);
  
            // Update the 'sharedWith' array in Firestore
            await updateDoc(usersRef, {
              sharedWith: sharedWith
            });
            await updateDoc(usersRef, { sharedFrom: currentUser.email });
  
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
  async getEmailsOfSharingUsers(): Promise<string[]> {
    try {
      const currentUser = await firstValueFrom(this.user$);
    
      if (currentUser) {
        const allUsersRef = collection(this.firestore, 'users');
        const querySnapshot = await getDocs(allUsersRef);
        
        const sharingUsers: string[] = [];
  
        for (const userDoc of querySnapshot.docs) {
          const userData = userDoc.data();
    
          if (
            userData['sharedWith'] &&
            userData['sharedWith'].includes(currentUser?.email)
          ) {
            sharingUsers.push(userData?.['sharedFrom']); // Collect the email of the user sharing data
          }
        }
    
        // Return unique email addresses using Set to remove duplicates
        return Array.from(new Set(sharingUsers));
      }
  
      return []; // Return an empty array if no current user is found
    } catch (error: any) {
      console.error('Error loading shared data', error);
      throw error;
    }
  }
  async getSharedWithAccounts(): Promise<{ uid: string, email: string }[]> {
    try {
      const currentUser = await firstValueFrom(this.user$);
  
      if (currentUser) {
        const allUsersRef = collection(this.firestore, 'users');
        const querySnapshot = await getDocs(allUsersRef);
        
        const sharedWithAccounts: { uid: string, email: string }[] = [];
  
        querySnapshot.forEach(userDoc => {
          const userData = userDoc.data();
  
          if (userData['sharedWith'] && userData['sharedWith'].includes(currentUser.email)) {
            const email = userData?.['sharedFrom']
            const uid = userDoc.id; // Assuming the document ID is also the UID
  
            sharedWithAccounts.push({ uid, email });
          }
        });
        console.log(sharedWithAccounts);
  
        return sharedWithAccounts;
      }
  
      return []; // Return an empty array if no current user is found
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

  async downloadFile(fileRef: string): Promise<any> {
    try {
      //const ref = this.storage.ref(fileRef);
      //const fileUrl = await this.storage.refFromURL(fileRef);
      const fileUrl =await getDownloadURL(ref(this.storage, fileRef));
      // Now you have the file URL, you can use it to download the file or display it

      // For example, if you want to download the file, you can use the file URL
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      // Use the blob as needed (e.g., create a download link or display the file)
      
      return blob; // Return the blob or the downloaded file content
    } catch (error: any) {
      console.error('Error downloading file:', error);
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

