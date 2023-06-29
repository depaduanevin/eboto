import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VotersPageFooterComponent } from '../main/home-page/components/voters-page-footer/voters-page-footer.component';
import { VotersPageHeaderComponent } from '../main/home-page/components/voters-page-header/voters-page-header.component';
import { VotesHomepageComponent } from '../main/votes-homepage/votes-homepage.component';
import { VoterLoginComponent } from '../main/voter-login/voter-login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [VotersPageHeaderComponent,
    VotersPageFooterComponent,
  VotesHomepageComponent, ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
exports: [VotersPageHeaderComponent,
  VotersPageFooterComponent,
VotesHomepageComponent,
]
})
export class SharedModule { }
