import { TuiModule } from './tui.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { LoginComponent } from './components/views/login/login.component';
import { UserProfileComponent } from './components/views/user-profile/user-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/views/home/home.component';
import { SearchFormComponent } from './components/shared/search-form/search-form.component';
import { ResultsComponent } from './components/views/search-results/search-results.component';
import { ConnectionCardComponent } from './components/shared/connection-card/connection-card.component';
import { CommonModule } from "@angular/common";
import { FavouriteConnectionsComponent } from './components/views/favourite-connections/favourite-connections.component';
import { DestinationCardComponent } from './components/shared/destination-card/destination-card.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from './services/http-interceptor';
import { ConnectionCardDetailComponent } from './components/shared/connection-card-detail/connection-card-detail.component';
import { DestinationsComponent } from './components/views/destinations/destinations.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserProfileComponent,
    HomeComponent,
    SearchFormComponent,
    ResultsComponent,
    ConnectionCardComponent,
    FavouriteConnectionsComponent,
    DestinationCardComponent,
    ConnectionCardDetailComponent,
    DestinationsComponent
  ],
  imports: [
    BrowserModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
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
