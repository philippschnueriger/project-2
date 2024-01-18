import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, DocumentReference, collection, addDoc, getDocs, deleteDoc, query, where, updateDoc, DocumentData } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { UserPreferences } from '../types/userPreferences';
import { Destination } from '../types/destination';

@Injectable({
  providedIn: 'root',
})
export class UserService {
    private userDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
        null
      );
    userData$: Observable<any> = this.userDataSubject.asObservable();
    private favouritesSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
      null
    );

    favourites$: Observable<any> = this.favouritesSubject.asObservable();

  constructor(private firestore: Firestore, private authService: AuthService) {}

  private async getUserDocRef(): Promise<DocumentReference | null> {
    try {
      const user = await this.authService.getCurrentUser();
      return user ? doc(this.firestore, 'users', user.uid) : null;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    console.error('Error:', error);
    throw error;
  }

  updateUserDataSubject(data: any): void {
    this.userDataSubject.next(data);
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
        const user = await this.authService.getCurrentUser();
      if (user) {
        const userRef = doc(this.firestore, 'users', user.uid);
        await setDoc(userRef, data);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async saveUserPreferences(data: UserPreferences): Promise<void> {
    try {
      const userRef = await this.getUserDocRef();
      if (userRef) {
        await setDoc(userRef, data);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

async getUserPreferences(): Promise<DocumentData | undefined | null> {
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
    const userRef = await this.getUserDocRef();
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

  

  async getAllDestinations(): Promise<Destination[]> {
    try {
      const destinationsRef = collection(this.firestore, 'destinations');
      const querySnapshot = await getDocs(destinationsRef);
      return querySnapshot.docs.map((doc) => doc.data() as Destination);
    } catch (error) {
      this.handleError(error);
    }
  }
}
