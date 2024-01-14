import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'firebase/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: User | null = null;
  error: string | null = null;
  loginForm: FormGroup;
  currentRoute: string = '';

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
    this.route.url.subscribe((segments) => {
      // Get the first segment of the URL (route path)
      this.currentRoute = segments[0]?.path || '';
    });
  }

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  onSubmit() {
    this.login(this.loginForm.value.email, this.loginForm.value.password);
  }

  onSignUp() {
    this.signUp(this.loginForm.value.email, this.loginForm.value.password);
  }

  onResetPassword() {
    this.resetPassword(this.loginForm.value.email);
  }

  async signUp(email: string, password: string) {
    try {
      await this.authService.signUp(email, password);
      this.router.navigate(['/favourites']);
      this.error = null;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        this.error = 'Email already in use';
      } else {
        this.error = 'unknown error';
        console.log(error);
      }
    }
  }

  async login(email: string, password: string) {
    try {
      await this.authService.login(email, password);
      this.router.navigate(['/favourites']);
      this.error = null;
    } catch (error: any) {
      if (error.code === 'auth/invalid-login-credentials') {
        this.error = 'Invalid e-mail or password';
      } else {
        this.error = 'unknown error';
        console.log(error);
      }
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      this.error = null;
    } catch (error: any) {
      this.error = 'unknown error';
      console.log(error);
    }
  }
  async resetPassword(email: string) {
    try {
      await this.authService.resetPassword(email);
      this.error = null;
    } catch (error: any) {
      this.error = 'unknown error';
      console.log(error);
    }
  }
}
