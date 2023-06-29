import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  collection,
  Firestore,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { FirestoreService } from 'src/app/services/firestore.service';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isLoading: boolean = false;
  positions: Array<any> = [];
  positionReference: Array<any> = [];
  candidates: Array<any> = [];
  voters: Array<any> = [];
  voteds: Array<any> = [];
  abstain: Array<any> = [];
  @ViewChild('pieChartCanvas') pieChartCanvas: ElementRef | undefined;
  interval: any;

  constructor(
    private firestore: Firestore,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit(): void {
    this.getPositions();
    this.getCandidates();
    this.getVoter();
    this.getVoteds();

    // this.interval = setInterval(() => {
    this.getCandidates();
    this.getAbstain();
    
    // }, 4000);
  }
  getVoter() {
    const voterInstance = collection(this.firestore, 'users');
    getDocs(voterInstance)
      .then((res: any) => {
        this.voters = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
      })
      .catch((err: any) => {
      });
  }
  getAbstain() {
    const dbInstance = collection(this.firestore, 'abstain_position');

    getDocs(dbInstance)
      .then((res: any) => {
        this.abstain = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
      })
      .catch((err: any) => {
        this.isLoading = false;
      });
  }
  getVoteds() {
    const voterInstance = collection(this.firestore, 'users');
    const votedQuery = query(voterInstance, where('type', '==', 'voted'));
    getDocs(votedQuery)
      .then((res: any) => {
        this.voteds = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        this.createPieChart(this.voters.length, this.voteds.length);
      })
      .catch((err: any) => {
      });
  }

  getPositions(id?: string) {
    const dbInstance = collection(this.firestore, 'positions');

    getDocs(dbInstance)
      .then((res: any) => {
        this.positions = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        this.positionReference = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        if (id) {
          this.positions = this.positions.filter(x => {
            return x.id === id;
          });
        } else {
          this.positions = this.positions.filter(x => {
            return x.id === this.positionReference[0].id;
          });
        }
        this.isLoading = false;
      })
      .catch((err: any) => {
        this.isLoading = false;
      });
  }

  onChangePosition(event: any) {
    this.getPositions(event.target.value);
  }

  getCandidates() {
    this.firestoreService.getVotesResult().subscribe((res) => {
      this.candidates = res;

      this.isLoading = false;
    });
  }
  createPieChart(voters: number, voted: number) {
    const totalVoters = voters;
    const votersVoted = voted;
    const votersNotVoted = totalVoters - votersVoted;

    const pieChartCanvas = document.getElementById('pieChartCanvas') as HTMLCanvasElement;
    const ctx = pieChartCanvas.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Voters Voted', 'Voters Not Voted'],
          datasets: [{
            data: [votersVoted, votersNotVoted],
            backgroundColor: ['#36A2EB', '#FF6384'],
            hoverBackgroundColor: ['#36A2EB', '#FF6384'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
    
  }
}
