import { TuiModule } from './tui.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { LoginComponent } from './components/views/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/views/home/home.component';
import { SearchFormComponent } from './components/shared/search-form/search-form.component';
import { ResultsComponent } from './components/views/search-results/search-results.component';
import { ConnectionCardComponent } from './components/shared/connection-card/connection-card.component';
import { CommonModule } from "@angular/common";
import { FavouritesComponent } from './components/views/favourites/favourites.component';
import { DestinationCardComponent } from './components/shared/destination-card/destination-card.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from './services/http-interceptor';
import { ConnectionCardDetailComponent } from './components/shared/connection-card-detail/connection-card-detail.component';
import { DestinationExplorerComponent } from './components/views/destination-explorer/destination-explorer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalTimePipe } from './components/shared/connection-card/local-time.pipe';
import { AccountComponent } from './components/views/account/account.component';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { SharedFavouritesComponent } from './components/views/shared-favourites/shared-favourites.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SearchFormComponent,
    ResultsComponent,
    ConnectionCardComponent,
    FavouritesComponent,
    DestinationCardComponent,
    ConnectionCardDetailComponent,
    DestinationExplorerComponent,
    AccountComponent,
    LocalTimePipe,
    SharedFavouritesComponent
  ],
  imports: [
    BrowserModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    CommonModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TuiModule,
    HttpClientModule
],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
