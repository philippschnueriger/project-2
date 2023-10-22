 import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../shared/services/firestore.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'firebase/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null; 
  data: any;
  profileForm: FormGroup;
  name: string | null = null;
  state: string | null = null;
  country: string | null = null;

  favourites: any;

  constructor(private authService: AuthService, private firestoreService: FirestoreService, private formBuilder: FormBuilder,) {
    this.profileForm = this.formBuilder.group({
      name: "",
      state: "",
      country: ""
    });
  }

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      this.getData();
      this.getFavouriteConnections();
    });
    this.firestoreService.userData$.subscribe((userData) => {
      this.data = userData;
    });
  }

  onSubmit() {
    this.name = this.profileForm.value.name;
    this.state = this.profileForm.value.state;
    this.country = this.profileForm.value.country;
    this.saveData()
  }

  async saveData() {
    let uid = this.user?.uid ? this.user?.uid : "";
    await this.firestoreService.saveUserData(uid, {name: this.name, state: this.state, country: this.country});
    await this.getData();
  }
  async getData() {
    let uid = this.user?.uid
    if (uid){
      await this.firestoreService.getUserData(uid);
      this.name = this.data.name;
      this.state = this.data.state;
      this.country = this.data.country;
    } else {
      console.log("no uid")
    }
  }
  async getFavouriteConnections() {
    let uid = this.user?.uid
    if (uid){
      this.favourites = await this.firestoreService.getFavouriteConnections(uid);
      console.log(this.favourites)
    } else {
      console.log("no uid")
    }
  }

}
