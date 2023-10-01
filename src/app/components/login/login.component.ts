import { Component,OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'firebase/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: User | null = null; 
  error: string | null = null;
  loginForm: FormGroup;


  constructor(private authService: AuthService, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  onSubmit() {
    this.login(this.loginForm.value.email, this.loginForm.value.password)
  }

  onSignUp() {
    this.signUp(this.loginForm.value.email, this.loginForm.value.password)
  }

  async signUp(email: string, password: string) {
    try {
      await this.authService.signUp(email, password)
      this.error = null;
      } catch (error: any) {
        if (error == "Firebase: Error (auth/email-already-in-use)."){
          this.error = "Email already in use";
        } else {
        this.error = "unknown error"
        console.log(error)
        }
      }
  };

  async login(email: string, password: string) {
    try {
      await this.authService.login(email, password)
      this.error = null;
      } catch (error: any) {
        if (error == "Firebase: Error (auth/invalid-login-credentials)."){
          this.error = "Invalid login credentials";
        } else {
        this.error = "unknown error"
        console.log(error)
        }
      }
  };
  
  async logout() {
    try {
      await this.authService.logout()
      this.error = null;
    } catch (error: any) {
      this.error = "unknown error"
      console.log(error)
    }
  }
}
