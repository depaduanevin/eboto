import { Component, OnInit } from '@angular/core';
import { collection, Firestore, getDocs } from 'firebase/firestore';
import { ToastrService } from 'ngx-toastr';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-vote-result',
  templateUrl: './vote-result.component.html',
  styleUrls: ['./vote-result.component.scss'],
})
export class VoteResultComponent implements OnInit {
  isLoading: boolean = false;
  title: Array<any> = [];
  voteSummary: Array<any> = [];
  positions: Array<any> = [];
  candidates: Array<any> = [];

  constructor(
    private firestore: Firestore,
    private toaster: ToastrService,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit(): void {
    // this.getCandidates();
    // this.getTitle();
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
  getCandidates() {
    this.firestoreService.getVotesResult().subscribe((res) => {
      this.candidates = res;

      this.isLoading = false;
    });
  }
}
