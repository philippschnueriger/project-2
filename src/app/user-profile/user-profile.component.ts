 import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../shared/services/firestore.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null; 
  data: any;

  constructor(private authService: AuthService, private firestoreService: FirestoreService) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  async saveData() {
    let uid = this.user?.uid ? this.user?.uid : "";
    await this.firestoreService.saveUserData(uid, {name: "New York", state: "NY", country: "USA"});
  }
  async getData() {
    let uid = this.user?.uid ? this.user?.uid : "";
    this.data = await this.firestoreService.getUserData(uid);
    console.log("data")
    console.log(this.data)
  }

}
