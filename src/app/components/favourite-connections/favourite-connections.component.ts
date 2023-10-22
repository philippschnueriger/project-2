import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../shared/services/firestore.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-favourite-connections',
  templateUrl: './favourite-connections.component.html',
  styleUrls: ['./favourite-connections.component.scss']
})
export class FavouriteConnectionsComponent implements OnInit {
  user: User | null = null; 
  favourites: any;

  constructor(private authService: AuthService, private firestoreService: FirestoreService) {
  }

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      this.getFavouriteConnections();
    });
    this.firestoreService.favourites$.subscribe((favourites) => {
      this.favourites = favourites;
    });
  }

  async getFavouriteConnections() {
    let uid = this.user?.uid
    if (uid){
      await this.firestoreService.getFavouriteConnections(uid);
    } else {
      console.log("no uid")
    }
  }

}
