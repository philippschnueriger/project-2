import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
    constructor(private firestore: Firestore) {}

    async saveUserData(uid: string, data: any): Promise<void> {
        console.log("service")
        try {
            await setDoc(doc(this.firestore, "users", uid), data);
            return;
        } catch (error: any) {
            console.log(error);
            throw error;
        }
    }

    async getUserData(uid: string): Promise<any> {
        console.log("service")
        try {
            const docSnap = await getDoc(doc(this.firestore, "users", uid));
            return docSnap.data()
        } catch (error: any) {
            console.log(error);
            throw error;
        }
    }

}