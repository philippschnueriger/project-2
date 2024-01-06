import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  error: null | undefined | string = null;

  constructor(private authService: AuthService, private router: Router) {
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
  editPreferences() {
    console.log("edit preferences")
  }

}
