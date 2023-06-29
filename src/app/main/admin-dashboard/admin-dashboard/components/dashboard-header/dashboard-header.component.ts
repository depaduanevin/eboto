import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss'],
})
export class DashboardHeaderComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  logOut() {
    this.router.navigate(['admin-login']);
  }
}
