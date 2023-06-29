import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './main/admin-login/admin-login/admin-login.component';
import { VoterLoginComponent } from './main/voter-login/voter-login.component';
import { VoteResultComponent } from './main/vote-result/vote-result.component';
import { VotesHomepageComponent } from './main/votes-homepage/votes-homepage.component';
import { VoterRegistrationComponent } from './main/voter-registration/voter-registration.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: AdminLoginComponent,
  // },

  {
    path: 'homepage',
    component: VotesHomepageComponent,
  },
  {
    path: 'admin-login',
    component: AdminLoginComponent,
  },
  {
    path: 'voter-login',
    component: VoterLoginComponent,
  },
  {
    path: 'voter-registration',
    component: VoterRegistrationComponent,
  },
  {
    path: '',
    redirectTo: 'homepage',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
