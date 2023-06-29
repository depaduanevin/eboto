import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  collection,
  doc,
  Firestore,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-votes',
  templateUrl: './votes.component.html',
  styleUrls: ['./votes.component.scss'],
})
export class VotesComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'votes'];
  displayedAbstainColumns: string[] = ['position', 'count'];
  isLoading: boolean = false;
  positions: Array<any> = [];
  data: Array<any> = [];
  abstain: Array<any> = [];
  dataSource = new MatTableDataSource<PeriodicElement>(this.data);
  abstainSource = new MatTableDataSource<PeriodicElement>(this.abstain);
  interval: any;
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private firestore: Firestore,
    private toastr: ToastrService,
    private firestoreService: FirestoreService
  ) {}
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.getData();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.getPosition();
    this.getData();
    // this.interval = setInterval(() => {
    this.getData();
    this.getAbstain();
    // }, 4000);
  }
  getPosition() {
    const dbInstance = collection(this.firestore, 'positions');

    getDocs(dbInstance)
      .then((res: any) => {
        this.positions = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
      })
      .catch((err: any) => {
        console.log(err);
        this.isLoading = false;
      });
  }
  getAbstain() {
    const dbInstance = collection(this.firestore, 'abstain_position');

    getDocs(dbInstance)
      .then((res: any) => {
        const abstainRaw = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        const positionRaw: any[] = [];
        this.positions.forEach(x => {
          abstainRaw.forEach(y => {
            if (x.id === y.pid) {
              positionRaw.push({id: y.id, pid: y.pid, position: x.description, count: y.count})
            }
          })
        });
        this.abstainSource = new MatTableDataSource<PeriodicElement>(positionRaw);
      })
      .catch((err: any) => {
        console.log(err);
        this.isLoading = false;
      });
  }
  filter(event: any) {
    this.dataSource.filter = event.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  getData() {
    this.firestoreService.getVotesResult().subscribe((res) => {
      this.data = res;
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.data);
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    });
  }

  reset() {
    let data = {
      votes: [],
    };
    this.isLoading = true;
    this.data.forEach((res: any) => {
      console.log(res.id);
      const dbInstance = doc(this.firestore, 'votes', res.id);

      updateDoc(dbInstance, data)
        .then((res: any) => {
          if (this.abstain.length > 0) {
            this.resetAbstain();
          }
          this.getData();
        })
        .catch((err: any) => {
          console.log(err);
        });
    });
    setTimeout(() => {
      this.toastr.success('Resets the Votes Sucessfully');
    }, 1000);
  }
  resetAbstain() {
    let data = {
      count: [],
    };
    this.abstain.forEach((res: any) => {
      const dbInstance = doc(this.firestore, 'abstain_position', res.id);

      updateDoc(dbInstance, data)
        .then((res: any) => {
          console.log(res);
          this.getData();
        })
        .catch((err: any) => {
          console.log(err);
        });
    });
  }
}

export interface PeriodicElement {
  candidate: string;
  candidateId: string;
  position: string;
  votes: any;
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
//   { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
//   { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
//   { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
//   { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
//   { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
//   { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
//   { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
//   { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
//   { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
// ];
