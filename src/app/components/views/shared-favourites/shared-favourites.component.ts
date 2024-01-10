import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SharingService } from 'src/app/services/sharing.service';
import { User } from 'firebase/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as data from 'src/app/data/destinations.json';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-shared-favourites',
  templateUrl: './shared-favourites.component.html',
  styleUrls: ['./shared-favourites.component.scss']
})
export class SharedFavouritesComponent {
  user: User | null = null;
  favourites: any;
  sort = ['Date', 'Price'];
  filters: any;
  share: any;
  sharingUsers: any;
  myEmail: string = '';
  sharedWith: any;
  showOverlay: boolean = false;
  data: any;

  constructor(
    private authService: AuthService, private sharingService: SharingService, private userService: UserService
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
    console.log('share favourites' )
    console.log(this.share.get('email')?.value)
    await this.sharingService.shareFavourites(this.share.get('email')?.value)
    this.sharingUsers = await this.sharingService.getSharedWithAccounts();
    this.sharedWith = await this.sharingService.getSharedWithForCurrentUser();
  }

  async getSharedData(){
    await this.sharingService.getSharedData();
  }
  async deleteSharedUser(user: any){
    await this.sharingService.removeCurrentUserFromSharedWith(user.uid);
    this.sharingUsers = await this.sharingService.getSharedWithAccounts();
  }
  async deleteSharedWithUser(email: string){
    console.log(email)
    await this.sharingService.removeEmailFromSharedWith(email);
    this.sharedWith = await this.sharingService.getSharedWithForCurrentUser();
  }
  async getSharedDataFromUser(uid: string){
    this.toggleOverlay();
    this.data = await this.sharingService.getSharedDataFromUser(uid);
    console.log(this.data)
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
    console.log(this.showOverlay)
  }

}
