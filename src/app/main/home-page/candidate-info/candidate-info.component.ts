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
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-candidate-info',
  templateUrl: './candidate-info.component.html',
  styleUrls: ['./candidate-info.component.scss']
})
export class CandidateInfoComponent implements OnInit {
  positions: Array<any> = [];
  candidates: Array<any> = [];
  isLoading: boolean = false;
  userData: Array<any> = [];
  title: Array<any> = [];
  uid: any;
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
    this.getPositions();
    this.getCandidates();
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
  getPositions() {
    const dbInstance = collection(this.firestore, 'positions');
    const q = query(dbInstance, orderBy('maximumVote', 'asc'));

    getDocs(q)
      .then((res: any) => {
        this.positions = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        this.isLoading = false;
      })
      .catch((err: any) => {
        console.log(err);
        this.isLoading = false;
      });
  }
  getCandidates() {
    const dbInstance = collection(this.firestore, 'candidates');

    getDocs(dbInstance)
      .then((res: any) => {
        this.candidates = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];

        this.isLoading = false;
      })
      .catch((err: any) => {
        console.log(err);
        this.isLoading = false;
      });
  }
  goToVote() {
    localStorage.setItem('first-login', 'false');
    this.router.navigate(['/voting-system']);
  }
}
