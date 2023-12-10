import { Component, OnInit, SimpleChange, OnChanges } from '@angular/core';
import { FirestoreService } from '../../shared/services/firestore.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'firebase/auth';
import { FormControl, FormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-favourite-connections',
  templateUrl: './favourite-connections.component.html',
  styleUrls: ['./favourite-connections.component.scss'],
})
export class FavouriteConnectionsComponent implements OnInit {
  user: User | null = null;
  favourites: any;
  sort = ['Date', 'Price'];
  filters: any;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      this.getFavouriteConnections();
    });
    this.firestoreService.favourites$.subscribe((favourites) => {
      this.favourites = favourites;
    });
  }

  ngOnInit() {
    this.filters = new FormGroup({
      sort: new FormControl(),
    });
    this.filters.get('sort')?.valueChanges.subscribe((newValue: any) => {
      console.log('New value of sort:', newValue);
      this.sortConnections(this.filters.get('sort')?.value);
    });
  }

  sortConnections(sort: string) {
    console.log(this.favourites);
    if (sort === 'Date') {
      this.favourites.sort(
        (a: any, b: any) => {
          const dateA = new Date(a.local_departure).getTime();
          const dateB = new Date(b.local_departure).getTime();
          return dateA - dateB;
        }
      );
    } else if (sort === 'Price') {
      console.log('sort by price');
      this.favourites.sort((a: any, b: any) => b.price - a.price);
    }
  }

  async getFavouriteConnections() {
    let uid = this.user?.uid;
    if (uid) {
      await this.firestoreService.getFavouriteConnections(uid);
    } else {
      console.log('no uid');
    }
  }
}
