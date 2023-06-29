import { Component, OnInit } from '@angular/core';
import {
  arrayUnion,
  collection,
  doc,
  Firestore,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-election-information',
  templateUrl: './election-information.component.html',
  styleUrls: ['./election-information.component.scss']
})
export class ElectionInformationComponent implements OnInit {
  isLoading: boolean = false;
  userData: Array<any> = [];
  uid: any;
  title: Array<any> = [];
  constructor(
    private firestore: Firestore,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.uid = localStorage.getItem('uid');
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.getUser();
    this.getTitle();
  }

  getUser() {
    const userInstance = collection(this.firestore, 'users');
    const q = query(userInstance, where('uid', '==', this.uid));
    getDocs(q).then((res: any) => {
      this.userData = [
        ...res.docs.map((doc: any) => {
          return { ...doc.data(), id: doc.id };
        }),
      ];

      if (this.userData[0]?.type === 'voted') {
        this.toastr.error('You are already voted!');

        this.isLoading = false;
        this.router.navigate(['vote-complete']);
      } else {
        if (!localStorage.getItem('first-login')) {
          localStorage.setItem('first-login', 'true');
          this.router.navigate(['election-information']);
        } else {
          return;
        }
      }
    });
  }

  getTitle() {
    const dbInstance = collection(this.firestore, 'election_title');

    getDocs(dbInstance)
      .then((res: any) => {
        this.title = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        this.isLoading = false;
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
  goToVote() {
    localStorage.setItem('first-login', 'false');
    this.router.navigate(['/voting-system']);
  }
}
