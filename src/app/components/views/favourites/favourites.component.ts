import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'firebase/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharingService } from 'src/app/services/sharing.service';
import { UserService } from 'src/app/services/user.service';

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

  constructor(
    private authService: AuthService, private userService: UserService
  ) {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      this.getFavouriteConnections();
    });
    this.userService.favourites$.subscribe((favourites) => {
      this.favourites = favourites;
    });
  }

  async ngOnInit() {
    this.filters = new FormGroup({
      sort: new FormControl(),
    });
    this.filters.get('sort')?.valueChanges.subscribe((newValue: any) => {
      this.sortConnections(this.filters.get('sort')?.value);
    });
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
    await this.userService.getFavouriteConnections();
  }
}
