import { Component, OnInit } from '@angular/core';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import {
  collection,
  Firestore,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-voters-page-header',
  templateUrl: './voters-page-header.component.html',
  styleUrls: ['./voters-page-header.component.scss'],
})
export class VotersPageHeaderComponent implements OnInit {
  userData: Array<any> = [];
  constructor(
    private router: Router,
    private auth: Auth,
    private toast: ToastrService,
    private fireStore: Firestore
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    const uid = localStorage.getItem('uid');

    if (!uid) {
      this.toast.error('Please Login');
      return;
    }
    const userInstance = collection(this.fireStore, 'users');
    const q = query(userInstance, where('uid', '==', uid));

    getDocs(q).then((res: any) => {
      this.userData = [
        ...res.docs.map((doc: any) => {
          return { ...doc.data(), id: doc.id };
        }),
      ];
    });
  }

  logOut() {
    this.auth.signOut().then((res: any) => {
      localStorage.clear();
      this.router.navigate(['voter-login']);
    });
  }

  updatePassword() {
    const email = localStorage.getItem('email')!;

    sendPasswordResetEmail(this.auth, email)
      .then((res: any) => {
        this.toast.success('Password Reset Email Sent');
      })
      .catch((err: any) => {
        console.log(err);
        this.toast.error('Sending Password Reset Email failed', err.message);
      });
  }
}
