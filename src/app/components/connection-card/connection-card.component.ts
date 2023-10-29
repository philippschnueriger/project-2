import { Component, Input } from '@angular/core';
import { Flight } from '../../shared/flight';
import { FirestoreService } from '../../shared/services/firestore.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-connection-card',
  templateUrl: './connection-card.component.html',
  styleUrls: ['./connection-card.component.scss']
})
export class ConnectionCardComponent {
  @Input() item!: Flight;
  @Input() docId!: string;
  @Input() deleteOption: boolean = false;
  user: User | null = null; 
  constructor(private authService: AuthService, private firestoreService: FirestoreService) {
  }
  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }
  getDuration(duration: any) {
    if (duration === undefined) {
      return '';
    }
    let hours = Math.floor(duration / 3600);
    let minutes = Math.floor((duration % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
  saveFavouriteConnection() {
    if (this.user?.uid) {
      this.firestoreService.saveFavouriteConnection(this.user.uid, this.item);
    }
  }
  deleteFavouriteConnection() {
    if (this.user?.uid) {
      this.firestoreService.deleteFavouriteConnection(this.user?.uid, this.item.id);
    };
  }
}
