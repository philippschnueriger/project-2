import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  collection,
  getDocs,
  DocumentReference,
  updateDoc,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SharingService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  private handleError(error: any): never {
    console.error('Error:', error);
    throw error;
  }

  private async getUserDocRef(): Promise<DocumentReference | null> {
    try {
      const user = await this.authService.getCurrentUser();
      return user ? doc(this.firestore, 'users', user.uid) : null;
    } catch (error) {
      this.handleError(error);
    }
  }

  getCollection(path: string) {
    return collection(this.firestore, path);
  }

  async shareFavourites(emailToShare: string): Promise<void> {
    try {
      const userRef = await this.getUserDocRef();
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
              sharedFrom: sharedFrom || emailToShare, // Update sharedFrom if it's empty
            });

            console.log(`Data shared successfully with ${emailToShare}.`);
          } else {
            console.log(`Data is already shared with ${emailToShare}.`);
          }
        } else {
          console.error('User document not found.');
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async getSharedData(): Promise<void> {
    try {
      const currentUser = await this.authService.getCurrentUser();

      if (currentUser) {
        const querySnapshot = await getDocs(this.getCollection('users'));

        const promises: Promise<any[]>[] = [];

        for (const userDoc of querySnapshot.docs) {
          const userData = userDoc.data();

          if (
            userData['sharedWith'] &&
            userData['sharedWith'].includes(currentUser.email)
          ) {
            const promise = getDocs(this.getCollection(`users/${userDoc.id}/favourites`)).then(
              (sharedDataSnapshot) => {
                return sharedDataSnapshot.docs.map((doc) => doc.data());
              }
            );
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
    } catch (error) {
      this.handleError(error);
    }
  }

  async getEmailsOfSharingUsers(): Promise<string[]> {
    try {
      const currentUser = await this.authService.getCurrentUser();
      if (!currentUser) return [];

      const querySnapshot = await getDocs(this.getCollection('users'));

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
      const uniqueSharingUsers = Array.from(
        new Set(sharingUsers.filter(Boolean))
      );

      return uniqueSharingUsers;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getSharedWithAccounts(): Promise<{ uid: string; email: string }[]> {
    try {
      const currentUser = await this.authService.getCurrentUser();
      if (!currentUser) return [];
      const querySnapshot = await getDocs(this.getCollection('users'));

      const sharedWithAccounts: Promise<{
        uid: string;
        email: string;
      } | null>[] = querySnapshot.docs.map(async (userDoc) => {
        const userData = userDoc.data();

        if (
          userData['sharedWith'] &&
          userData['sharedWith'].includes(currentUser.email)
        ) {
          const email = userData?.['sharedFrom'];
          const uid = userDoc.id;

          return { uid, email };
        }
        return null;
      });

      const resolvedAccounts = await Promise.all(sharedWithAccounts);
      const filteredAccounts = resolvedAccounts.filter(Boolean) as {
        uid: string;
        email: string;
      }[];

      return filteredAccounts;
    } catch (error) {
      this.handleError(error);
    }
  }

  async removeCurrentUserFromSharedWith(otherUserUid: string): Promise<void> {
    try {
      const currentUser = await this.authService.getCurrentUser();
      if (currentUser) {
        const otherUsersRef = doc(this.firestore, 'users', otherUserUid);
        const otherUserDoc = await getDoc(otherUsersRef);

        if (otherUserDoc.exists()) {
          const userData = otherUserDoc.data();
          const sharedWithEmails = userData['sharedWith'] || [];

          const updatedSharedWithEmails = sharedWithEmails.filter(
            (email: string) => email !== currentUser.email
          );

          await updateDoc(otherUsersRef, {
            sharedWith: updatedSharedWithEmails,
          });

          console.log(
            `Removed ${currentUser.email} from sharedWith array of user with UID: ${otherUserUid}`
          );
        } else {
          console.error('User document not found for UID:', otherUserUid);
        }
      } else {
        console.error('Current user not found.');
      }
    } catch (error) {
      this.handleError(error);
    }
  }
  async getCurrentUserEmail(): Promise<string> {
    try {
      const currentUser = await this.authService.getCurrentUser();

      if (currentUser) {
        return currentUser.email || '';
      }

      return ''; // Return an empty string if no current user is found
    } catch (error) {
      this.handleError(error);
    }
  }
  async getSharedWithForCurrentUser(): Promise<string[]> {
    try {
      const currentUser = await this.authService.getCurrentUser();

      if (currentUser) {
        const userDocRef = doc(this.firestore, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          return userData['sharedWith'] || [];
        } else {
          console.error('User document not found for current user.');
          return [];
        }
      } else {
        console.error('Current user not found.');
        return [];
      }
    } catch (error) {
      this.handleError(error);
    }
  }
  async removeEmailFromSharedWith(emailToRemove: string): Promise<void> {
    try {
      const currentUser = await this.authService.getCurrentUser();

      if (currentUser) {
        const userDocRef = doc(this.firestore, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const sharedWithEmails = userData['sharedWith'] || [];
          console.log(sharedWithEmails);

          const updatedSharedWithEmails = sharedWithEmails.filter(
            (email: string) => email !== emailToRemove
          );

          await updateDoc(userDocRef, {
            sharedWith: updatedSharedWithEmails,
          });
        } else {
          console.error('User document not found for current user.');
        }
      } else {
        console.error('Current user not found.');
      }
    } catch (error) {
      this.handleError(error);
    }
  }
  async getSharedDataFromUser(userUid: string): Promise<any[]> {
    try {
      const currentUser = await this.authService.getCurrentUser();

      if (currentUser) {
        const sharedData: any[] = [];
        const sharedDataSnapshot = await getDocs(this.getCollection(`users/${userUid}/favourites`));

        sharedDataSnapshot.forEach((doc) => {
          sharedData.push(doc.data());
        });

        return sharedData;
      } else {
        console.error('Current user not found.');
        return [];
      }
    } catch (error) {
      this.handleError(error);
    }
  }
}
