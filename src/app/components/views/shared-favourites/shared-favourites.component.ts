import { Component } from '@angular/core';
import { SharingService } from 'src/app/services/sharing.service';
import { User } from 'firebase/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { TripSegment } from 'src/app/types/tripSegment';

@Component({
  selector: 'app-shared-favourites',
  templateUrl: './shared-favourites.component.html',
  styleUrls: ['./shared-favourites.component.scss']
})
export class SharedFavouritesComponent {
  user: User | null = null;
  favourites: boolean = false;
  sort = ['Date', 'Price'];
  share!: FormGroup;
  sharingUsers!: {uid: string, email: string}[];
  myEmail: string = '';
  sharedWith: string[] = [];
  showOverlay: boolean = false;
  data: TripSegment[] = [];

  constructor(
    private sharingService: SharingService, private userService: UserService
  ) {}
  async ngOnInit() {
    this.share = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email]}),
    });
    this.sharingUsers = await this.sharingService.getSharedWithAccounts();
    this.myEmail = await this.sharingService.getCurrentUserEmail();
    this.sharedWith = await this.sharingService.getSharedWithForCurrentUser();
  }

  async shareFavourites() {
    await this.sharingService.shareFavourites(this.share.get('email')?.value)
    this.sharingUsers = await this.sharingService.getSharedWithAccounts();
    this.sharedWith = await this.sharingService.getSharedWithForCurrentUser();
  }

  async getSharedData(){
    await this.sharingService.getSharedData();
  }
  async deleteSharedUser(user: { uid: string; email: string; }){
    await this.sharingService.removeCurrentUserFromSharedWith(user.uid);
    this.sharingUsers = await this.sharingService.getSharedWithAccounts();
  }
  async deleteSharedWithUser(email: string){
    await this.sharingService.removeEmailFromSharedWith(email);
    this.sharedWith = await this.sharingService.getSharedWithForCurrentUser();
  }
  async getSharedDataFromUser(uid: string){
    this.toggleOverlay();
    this.data = await this.sharingService.getSharedDataFromUser(uid);
  }
  async getFavouriteConnections() {
    let uid = this.user?.uid;
    if (uid) {
      await this.userService.getFavouriteConnections();
    } else {
      console.log('no uid');
    }
  }
  toggleOverlay() {
    this.showOverlay = !this.showOverlay;
  }

}
