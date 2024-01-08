import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'firebase/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as data from 'src/app/data/destinations.json';

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
    private authService: AuthService,
  ) {}
  async ngOnInit() {
    this.share = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email]}),
    });
    this.sharingUsers = await this.authService.getSharedWithAccounts();
    this.myEmail = await this.authService.getCurrentUserEmail();
    this.sharedWith = await this.authService.getSharedWithForCurrentUser();
  }

  async shareFavourites() {
    console.log('share favourites' )
    console.log(this.share.get('email')?.value)
    await this.authService.shareFavourites(this.share.get('email')?.value)
    this.sharingUsers = await this.authService.getSharedWithAccounts();
    this.sharedWith = await this.authService.getSharedWithForCurrentUser();
  }

  async getSharedData(){
    await this.authService.getSharedData();
  }
  async deleteSharedUser(user: any){
    await this.authService.removeCurrentUserFromSharedWith(user.uid);
    this.sharingUsers = await this.authService.getSharedWithAccounts();
  }
  async deleteSharedWithUser(email: string){
    console.log(email)
    await this.authService.removeEmailFromSharedWith(email);
    this.sharedWith = await this.authService.getSharedWithForCurrentUser();
  }
  async getSharedDataFromUser(uid: string){
    this.toggleOverlay();
    this.data = await this.authService.getSharedDataFromUser(uid);
    console.log(this.data)
  }
  async getFavouriteConnections() {
    let uid = this.user?.uid;
    if (uid) {
      await this.authService.getFavouriteConnections();
    } else {
      console.log('no uid');
    }
  }
  toggleOverlay() {
    this.showOverlay = !this.showOverlay;
    console.log(this.showOverlay)
  }

}
