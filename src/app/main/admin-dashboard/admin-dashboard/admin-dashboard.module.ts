import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { DashboardSidebarComponent } from './components/dashboard-sidebar/dashboard-sidebar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VotesComponent } from './components/votes/votes.component';
import { ManageVotersComponent } from './components/manage-voters/manage-voters.component';
import { ManagePositionsComponent } from './components/manage-positions/manage-positions.component';
import { ManageCandidatesComponent } from './components/manage-candidates/manage-candidates.component';
import { BallotPositionsComponent } from './components/ballot-positions/ballot-positions.component';
import { ElectionTitleComponent } from './components/election-title/election-title.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { AbstainComponent } from './components/abstain/abstain.component';
const routes: Routes = [
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'votes',
        component: VotesComponent,
      },
      {
        path: 'manage-users',
        component: ManageUsersComponent,
      },
      {
        path: 'manage-voters',
        component: ManageVotersComponent,
      },
      {
        path: 'manage-positions',
        component: ManagePositionsComponent,
      },
      {
        path: 'manage-candidates',
        component: ManageCandidatesComponent,
      },
      {
        path: 'ballot-position',
        component: BallotPositionsComponent,
      },
      {
        path: 'election-title',
        component: ElectionTitleComponent,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'admin-dashboard',
    pathMatch: 'full',
  },
];

@NgModule({
  declarations: [
    AdminDashboardComponent,
    DashboardHeaderComponent,
    DashboardSidebarComponent,
    DashboardComponent,
    VotesComponent,
    ManageVotersComponent,
    ManagePositionsComponent,
    ManageCandidatesComponent,
    BallotPositionsComponent,
    ElectionTitleComponent,
    BreadcrumbComponent,
    ManageUsersComponent,
    AbstainComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    ReactiveFormsModule,
    FormsModule,
    NgChartsModule,
  ],
})
export class AdminDashboardModule {}
