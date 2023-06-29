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
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ToastrService } from 'ngx-toastr';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import {
  Auth,
  createUserWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
})
export class ManageUsersComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'position',
    'name',
    'weight',
    'symbol',
    'action',
  ];

  votersData: Array<any> = [];

  selectedId: any;
  dataSource = new MatTableDataSource<VotersData>(this.votersData);
  public votersForm: FormGroup = new FormGroup({});

  file!: File;
  fileRestriction: Array<any> = ['image/jpeg', 'image/png'];
  isFileValid: boolean = true;
  isLoading: boolean = false;
  positions: Array<any> = [];

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private firestoreService: FirestoreService,
    private fireStore: Firestore,
    private toastr: ToastrService,
    private storage: Storage,
    private auth: Auth
  ) {}
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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
  buildForm() {
    this.votersForm = new FormGroup({
      lastName: new FormControl('', [Validators.required]),
      firstName: new FormControl('', Validators.required),
      file: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      contactNumber: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
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
  fileChange(event: any) {
    if (this.fileRestriction.includes(event.target.files[0].type)) {
      this.file = event.target.files[0];
      this.isFileValid = true;
    } else {
      this.toastr.error('Invalid file format');
      this.isFileValid = false;
    }
  }

  getData() {
    this.isLoading = true;

    const dbInstance = collection(this.fireStore, 'users');

    getDocs(dbInstance)
      .then((res: any) => {
        this.votersData = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        this.dataSource = new MatTableDataSource<VotersData>(this.votersData);
        this.dataSource.paginator = this.paginator;

        this.isLoading = false;
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
  selectData(data: any) {
    // console.log(this.selectedData);

    if (data === undefined) {
      return;
    }

    this.selectedId = data;

    this.votersForm = new FormGroup({
      lastName: new FormControl(data.lastName || '', [Validators.required]),
      firstName: new FormControl(data.firstName || '', Validators.required),
      file: new FormControl(''),
      email: new FormControl(data.email || '', Validators.required),
      contactNumber: new FormControl(
        data.contactNumber || '',
        Validators.required
      ),
      password: new FormControl(''),
    });
  }

  async updateStatus(data: any, id: any) {
    this.isLoading = true;
    const updateUser = doc(this.fireStore, 'users', id.id);

    const votersInfo = collection(this.fireStore, 'voters_information');

    if (data == 'approved') {
      console.log(data, id);
      const createUser = await createUserWithEmailAndPassword(
        this.auth,
        id.email,
        id.password
      );

      updateProfile(createUser.user, {
        displayName: id.name,
      }).catch((err) => {
        console.log(err);
      });
      let userStatus = {
        accStatus: data,
        uid: createUser.user.uid,
      };
      let infoStatus = {
        status: data,
        voterId: createUser.user.uid,
      };
      const queryVoters = query(votersInfo, where('email', '==', id.email));

      getDocs(queryVoters).then((res: any) => {
        const specificVoter = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        const updateVoter = doc(
          this.fireStore,
          'voters_information',
          specificVoter[0].id
        );

        updateDoc(updateUser, userStatus)
          .then((res: any) => {
            updateDoc(updateVoter, infoStatus)
              .then((res: any) => {
                this.toastr.success('Information updated successfully');
                this.ngAfterViewInit();

                this.isLoading = false;

                this.votersForm.reset();
              })
              .catch((err: any) => {
                console.log(err.message);
              });
          })
          .catch((err: any) => {
            console.log(err.message);
          });
      });
    }
  }

  deleteVoter(data: any) {
    this.isLoading = true;

    const dbInstance = collection(this.fireStore, 'voters_information');
    const deleteInstance = doc(this.fireStore, 'users', data.id);

    deleteDoc(deleteInstance).then((res: any) => {
      console.log(res);

      const votesQuery = query(dbInstance, where('voterId', '==', data.uid));
      getDocs(votesQuery)
        .then((res: any) => {
          const data = [
            ...res.docs.map((docRes: any) => {
              return { ...docRes.data(), id: docRes.id };
            }),
          ];
          const votesInstance = doc(
            this.fireStore,
            'voters_information',
            data[0].id
          );

          deleteDoc(votesInstance)
            .then((res: any) => {
              this.isLoading = false;
              this.toastr.success('Voter Deleted Successfully!');
              this.selectedId = '';
              this.getData();
            })
            .catch((err: any) => {
              this.isLoading = false;
              this.toastr.error('Voter Deleting Failed!');
              this.selectedId = '';
              this.getData();
            });
        })
        .catch((err: any) => {
          console.log(err);
        });
    });
  }
}

export interface VotersData {
  accStatus: string;
  email: string;
  name: string;
  password: string;
  srCode: string;
  type: string;
  uid: string;
  username: string;
}
