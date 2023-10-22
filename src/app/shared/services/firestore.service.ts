import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, getDocs, collection, collectionData, addDoc} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
    private userDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    userData$: Observable<any> = this.userDataSubject.asObservable();

    private favouritesSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    favourites$: Observable<any> = this.favouritesSubject.asObservable();

    constructor(private firestore: Firestore) {}

    async saveFavouriteConnection(uid: string, data: any): Promise<void> {
      try {
          const userRef = doc(this.firestore, "users", uid);
          const favouritesRef = collection(userRef, "favourites")
          await addDoc(favouritesRef, data);
          return;
      } catch (error: any) {
          console.log(error);
          throw error;
      }
    }
    async getFavouriteConnections(uid: string): Promise<void> {
      try {
        const userRef = doc(this.firestore, "users", uid);
        const favouritesRef = collection(userRef, "favourites")
        const querySnapshot = await getDocs(favouritesRef)
        this.favouritesSubject.next(querySnapshot.docs.map(doc => doc.data()));
      } catch (error: any) {
        console.error('Error loading user data', error);
        throw error;
       }
    }

    async saveUserData(uid: string, data: any): Promise<void> {
        try {
            await setDoc(doc(this.firestore, "users", uid), data);
            return;
        } catch (error: any) {
            console.log(error);
            throw error;
        }
    }
    async getUserData(uid: string): Promise<void> {
        try {
          const docSnap = await getDoc(doc(this.firestore, "users", uid));
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