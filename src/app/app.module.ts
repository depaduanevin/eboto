import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminDashboardModule } from './main/admin-dashboard/admin-dashboard/admin-dashboard.module';
import { AdminLoginComponent } from './main/admin-login/admin-login/admin-login.component';
import { DataTablesModule } from 'angular-datatables';
import { ToastrModule } from 'ngx-toastr';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { VotersSidePageComponent } from './main/home-page/voters-side-page/voters-side-page.component';
import { VotersSideModule } from './main/home-page/voters-side.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FirestoreService } from './services/firestore.service';
import {
  provideAnalytics,
  getAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { VoteSubmittedComponent } from './main/home-page/vote-submitted/vote-submitted.component';
import { VoterLoginComponent } from './main/voter-login/voter-login.component';
import { JwtModule, JwtModuleOptions } from '@auth0/angular-jwt';
import { VoteResultComponent } from './main/vote-result/vote-result.component';
import { VotesHomepageComponent } from './main/votes-homepage/votes-homepage.component';
import { VoterRegistrationComponent } from './main/voter-registration/voter-registration.component';
import { VotersPageHeaderComponent } from './main/home-page/components/voters-page-header/voters-page-header.component';
import { VotersPageFooterComponent } from './main/home-page/components/voters-page-footer/voters-page-footer.component';
import { SharedModule } from './shared/shared.module';
import { RouterModule } from '@angular/router';

export function tokenGetter() {
  return localStorage.getItem('token');
}
@NgModule({
  declarations: [
    AppComponent,
    AdminLoginComponent,
    VoterLoginComponent,
    VoteResultComponent,
    VoterRegistrationComponent,
  ],
  imports: [
    SharedModule,
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    AdminDashboardModule,
    DataTablesModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    VotersSideModule,
    FormsModule,
    ReactiveFormsModule,
    provideAnalytics(() => getAnalytics()),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
      },
    }),
  ],
  providers: [FirestoreService, ScreenTrackingService, UserTrackingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
