 import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'firebase/auth';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  user: User | null = null; 
  data: any;
  profileForm: FormGroup;
  name: string | null = null;
  state: string | null = null;
  country: string | null = null;
  error: string | null = null;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router, private userService: UserService) {
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
    });
    this.userService.userData$.subscribe((userData) => {
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
    await this.userService.saveUserData({name: this.name, state: this.state, country: this.country});
    await this.getData();
  }
  async getData() {
    let uid = this.user?.uid
    if (uid){
      await this.userService.getUserData();
      this.name = this.data.name;
      this.state = this.data.state;
      this.country = this.data.country;
    } else {
      console.log("no uid")
    }
  }
  async logout() {
    try {
      await this.authService.logout()
      this.error = null;
      this.router.navigate(['/login']);
    } catch (error: any) {
      this.error = "unknown error"
      console.log(error)
    }
  }
  async updatePassword() {
    console.log("update password")
    //await this.authService.changePassword(password) // TODO
  }
}
