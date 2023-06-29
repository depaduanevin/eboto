import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  collapsed:boolean=false
  constructor() { }

  ngOnInit(): void {
  }


  toCollapse(){

    this.collapsed=this.collapsed ? false :true
  }

}
