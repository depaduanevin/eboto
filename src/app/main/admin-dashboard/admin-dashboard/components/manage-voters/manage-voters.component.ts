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
import { data } from 'jquery';
@Component({
  selector: 'app-manage-voters',
  templateUrl: './manage-voters.component.html',
  styleUrls: ['./manage-voters.component.scss'],
})
export class ManageVotersComponent implements AfterViewInit {
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
        console.log(err);
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

    const dbInstance = collection(this.fireStore, 'voters_information');
    const q = query(dbInstance, where('status', '==', 'approved'));

    getDocs(q)
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
  uploadFile(event: any) {
    this.isLoading = true;
    if (!this.votersForm.valid && !this.file) {
      return console.log('not valid');
    }

    const storageRef = ref(this.storage, `images/${this.file.name}`);
    const upload = uploadBytesResumable(storageRef, this.file);

    upload.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);

        if (progress === 100) {
          setTimeout(() => {
            getDownloadURL(upload.snapshot.ref).then((url) => {
              this.createVoters(url, upload.snapshot.metadata);
            });
          }, 2000);
        }
      },
      () => {
        getDownloadURL(upload.snapshot.ref).then((url) => {
          console.log('dlurl', url);
        });
      }
    );
  }

  async createVoters(url: any, imageData: any) {
    const votersInstance = collection(this.fireStore, 'voters_information');
    const usersInstance = collection(this.fireStore, 'users');

    const createUser = await createUserWithEmailAndPassword(
      this.auth,
      this.votersForm.value.email,
      this.votersForm.value.password
    );

    updateProfile(createUser.user, {
      displayName:
        this.votersForm.value.firstName + ' ' + this.votersForm.value.lastName,
    }).catch((err) => {
      console.log(err);
    });

    let votersData = {
      contactNumber: this.votersForm.value.contactNumber,

      displayPictureUrl: url,
      email: this.votersForm.value.email,
      firstName: this.votersForm.value.firstName,
      lastName: this.votersForm.value.lastName,
      voterId: createUser.user.uid,
    };
    let usersData = {
      email: this.votersForm.value.email,

      name:
        this.votersForm.value.firstName + ' ' + this.votersForm.value.lastName,
      password: this.votersForm.value.password,
      type: 'voter',
      uid: createUser.user.uid,
      username: this.votersForm.value.firstName,
    };
    addDoc(votersInstance, votersData)
      .then((res: any) => {
        console.log(res);
      })
      .catch((err: any) => {
        console.log(err);
      });
    addDoc(usersInstance, usersData)
      .then((res: any) => {
        console.log(res);
      })
      .catch((err: any) => {
        console.log(err);
      });
    this.toastr.success('Voter added successfully');
    this.getData();
    this.isLoading = false;

    this.votersForm.reset();
  }

  updateVoter() {
    this.isLoading = true;

    let votersData = {
      contactNumber: this.votersForm.value.contactNumber,

      email: this.votersForm.value.email,
      firstName: this.votersForm.value.firstName,
      lastName: this.votersForm.value.lastName,
    };
    const updateInstance = doc(
      this.fireStore,
      'voters_information',
      this.selectedId.id
    );
    updateDoc(updateInstance, votersData)
      .then((res: any) => {
        console.log(res);

        this.updateToVotes();
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  updateToVotes() {
    const dbInstance = collection(this.fireStore, 'users');
    const voterQuery = query(
      dbInstance,
      where('uid', '==', this.selectedId.voterId)
    );
    getDocs(voterQuery).then((res: any) => {
      const data = [
        ...res.docs.map((docRes: any) => {
          return { ...docRes.data(), id: docRes.id };
        }),
      ];
      const votesInstance = doc(this.fireStore, 'users', data[0]?.id);
      let usersData = {
        email: this.votersForm.value.email,

        name:
          this.votersForm.value.firstName +
          ' ' +
          this.votersForm.value.lastName,
        password: this.votersForm.value.password,
        type: 'voter',
        username: this.votersForm.value.firstName,
      };
      updateDoc(votesInstance, usersData)
        .then((res: any) => {
          this.isLoading = false;
          this.toastr.success('Voter Info Updated Successfully!');
          this.selectedId = '';
          this.getData();
        })
        .catch((err: any) => {
          console.log(err);
        });
    });
  }

  deleteVoter(data: any) {
    this.isLoading = true;

    const dbInstance = collection(this.fireStore, 'users');
    const deleteInstance = doc(this.fireStore, 'voters_information', data.id);

    deleteDoc(deleteInstance).then((res: any) => {
      console.log(res);

      const votesQuery = query(dbInstance, where('uid', '==', data.voterId));
      getDocs(votesQuery)
        .then((res: any) => {
          const data = [
            ...res.docs.map((docRes: any) => {
              return { ...docRes.data(), id: docRes.id };
            }),
          ];
          const votesInstance = doc(this.fireStore, 'users', data[0].id);

          deleteDoc(votesInstance)
            .then((res: any) => {
              console.log(res);
              this.isLoading = false;
              this.toastr.success('Coter Deleted Successfully!');
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
  contactNumber?: string;
  displayPictureUrl?: string;
  email?: string;
  firstName?: string;
  id?: string;
  lastName?: string;
  voterId?: string;
}
