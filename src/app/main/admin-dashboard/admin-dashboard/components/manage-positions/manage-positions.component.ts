import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
export interface Position {
  description?: string;
  maxVote?: string;
  id?: string;
}

@Component({
  selector: 'app-manage-positions',
  templateUrl: './manage-positions.component.html',
  styleUrls: ['./manage-positions.component.scss'],
})
export class ManagePositionsComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'action'];
  data: Array<any> = [];
  dataSource = new MatTableDataSource<Position>(this.data);

  isLoading: boolean = false;
  positions: Array<any> = [];

  public positionForm: FormGroup = new FormGroup({});

  updateId: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private fireStore: Firestore,
    private toastr: ToastrService
  ) {}

  ngAfterViewInit() {
    this.getData();
    this.buildForm();

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
    this.getData();
    this.buildForm();
    this.getPosition();
  }
  getPosition() {
    const dbInstance = collection(this.fireStore, 'positions');

    getDocs(dbInstance)
      .then((res: any) => {
        this.positions = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
      })
      .catch((err: any) => {
        this.isLoading = false;
      });
  }
  buildForm() {
    this.positionForm = new FormGroup({
      description: new FormControl('', [Validators.required]),
      maxVote: new FormControl('', Validators.required),
    });
  }
  clearForm() {
    this.positionForm.reset();
    this.updateId = '';
  }
  searchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  filter(event: any) {
    this.dataSource.filter = event.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getData() {
    this.isLoading = true;
    const dbInstance = collection(this.fireStore, 'positions');

    getDocs(dbInstance)
      .then((res: any) => {
        this.data = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        this.isLoading = false;

        this.dataSource = new MatTableDataSource<Position>(this.data);
        this.dataSource.paginator = this.paginator;
      })
      .catch((err: any) => {
        this.isLoading = false;
      });
  }

  createPosition() {
    this.isLoading = true;
    const modal = document.getElementById('save-position')!;

    modal.classList.add('uk-modal-close');
    if (this.positionForm.valid) {
      let data = {
        description: this.positionForm.value.description,
        maximumVote: this.positionForm.value.maxVote,
      };
      const dbInstance = collection(this.fireStore, 'positions');
      addDoc(dbInstance, data)
        .then((res: any) => {
          this.getData();
          this.toastr.success('Position Added!');

          this.positionForm.reset();
          this.isLoading = false;
        })
        .catch((err: any) => {
        });
    } else {
      this.toastr.error('Please fill up the required fields!');
      this.isLoading = false;

      this.positionForm.markAllAsTouched();
    }
  }

  deletePosition(id: any) {
    this.isLoading = true;

    const dbInstance = doc(this.fireStore, 'positions', id);
    deleteDoc(dbInstance)
      .then((res: any) => {
        this.isLoading = false;
        this.toastr.success('Position Deleted!');

        this.getData();
      })
      .catch((err: any) => {
      });
  }
  selectUpdate(data: any) {
    this.updateId = data.id;

    this.positionForm = new FormGroup({
      description: new FormControl(data.description || '', [
        Validators.required,
      ]),
      maxVote: new FormControl(data.maximumVote || '', Validators.required),
    });
  }

  updatePosition() {
    if (!this.positionForm.valid) {
      this.toastr.error('Please fill up the required fields!');
      this.isLoading = false;
      this.updateId = '';

      this.positionForm.markAllAsTouched();
      return;
    }
    let data = {
      description: this.positionForm.value.description,
      maximumVote: this.positionForm.value.maxVote,
    };
    const dbInstance = doc(this.fireStore, 'positions', this.updateId);

    updateDoc(dbInstance, data)
      .then((res: any) => {
        this.isLoading = false;

        this.toastr.success('Position Updated!');
        this.getData();

        this.updateId = '';
      })
      .catch((err: any) => {
      });
  }
}
