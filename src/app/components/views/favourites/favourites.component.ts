import { Component, OnInit, SimpleChange, OnChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'firebase/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { SharingService } from 'src/app/services/sharing.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss'],
})
export class FavouritesComponent implements OnInit {
  user: User | null = null;
  favourites: any;
  sort = ['Date', 'Price'];
  filters: any;
  share: any;
  sharingUsers: any;
  myEmail: string = '';
  sharedWith: any;

  constructor(
    private authService: AuthService, private sharingService: SharingService
  ) {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      this.getFavouriteConnections();
    });
    this.authService.favourites$.subscribe((favourites) => {
      this.favourites = favourites;
    });
  }

  async ngOnInit() {
    this.share = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email]}),
    });
    this.filters = new FormGroup({
      sort: new FormControl(),
    });
    this.filters.get('sort')?.valueChanges.subscribe((newValue: any) => {
      this.sortConnections(this.filters.get('sort')?.value);
    });
    this.sharingUsers = await this.sharingService.getSharedWithAccounts();
    this.myEmail = await this.sharingService.getCurrentUserEmail();
    this.sharedWith = await this.sharingService.getSharedWithForCurrentUser();
  }

  sortConnections(sort: string) {
    if (sort === 'Date') {
      this.favourites.sort(
        (a: any, b: any) => {
          const dateA = new Date(a.local_departure).getTime();
          const dateB = new Date(b.local_departure).getTime();
          return dateA - dateB;
        }
      );
    } else if (sort === 'Price') {
      this.favourites.sort((a: any, b: any) => b.price - a.price);
    }
  }

  async getFavouriteConnections() {
    let uid = this.user?.uid;
    if (uid) {
      await this.authService.getFavouriteConnections();
    } else {
      console.log('no uid');
    }
  }
}
