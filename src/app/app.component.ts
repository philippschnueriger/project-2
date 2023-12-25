import { Component, inject, OnInit } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;
  mobileNavOpen = false;
  user: User | null = null;
  error: string | null = null;

  constructor(private authService: AuthService) {
    const aCollection = collection(this.firestore, 'items');
    this.items$ = collectionData(aCollection);
  }

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  toggleNav() {
    this.mobileNavOpen = !this.mobileNavOpen;
  }

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
