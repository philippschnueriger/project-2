import { Component,OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: User | null = null; 
  error: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  signUp(email: string, password: string) {
    try {
      this.authService.signUp(email, password)
      console.log('User signed up successfully');
      } catch (error: any) {
        this.error = error.message; 
        console.log(this.error)
      }
  };

  login(email: string, password: string) {
    try {
      this.authService.login(email, password)
      console.log('User is logged in');
      } catch (error: any) {
        this.error = error.message; 
        console.log(this.error)
      }
  };
  
  logout() {
    try {
      this.authService.logout()
      console.log('User is logged out');
    } catch (error: any) {
      this.error = error.message; 
      console.log(this.error)
    }
  }
}
