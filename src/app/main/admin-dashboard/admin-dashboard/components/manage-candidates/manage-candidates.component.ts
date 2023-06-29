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
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Storage } from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-manage-candidates',
  templateUrl: './manage-candidates.component.html',
  styleUrls: ['./manage-candidates.component.scss'],
})
export class ManageCandidatesComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'position',
    'name',
    'weight',
    'symbol',
    'platform',
    'action',
  ];

  data: Array<any> = [];
  selectedData: Array<any> = [];

  positions: Array<any> = [];

  selectedFile: any;
  selectedId: any;

  dataSource = new MatTableDataSource<Candidates>(this.data);
  public candidateForm: FormGroup = new FormGroup({});

  file!: File;
  fileRestriction: Array<any> = ['image/jpeg', 'image/png'];
  isFileValid: boolean = true;
  isLoading: boolean = false;
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private fireStore: Firestore,
    private storage: Storage,
    private toastr: ToastrService
  ) {}
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.getData();
    this.selectData(undefined);

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
    this.getPosition();
    this.getData();
    this.buildForm();
    this.selectData(undefined);
  }
  buildForm() {
    this.candidateForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required),

      file: new FormControl('', Validators.required),

      platform: new FormControl('', Validators.required),
      information: new FormControl('', Validators.required)
    });
  }
  clearForm() {
    this.candidateForm.reset();
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
      // this.toastr.error('Invalid file format');
      this.isFileValid = false;
    }
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
  getData() {
    this.isLoading = true;
    const dbInstance = collection(this.fireStore, 'candidates');

    getDocs(dbInstance).then((res: any) => {
      this.data = [
        ...res.docs.map((doc: any) => {
          return { ...doc.data(), id: doc.id };
        }),
      ];
      this.dataSource = new MatTableDataSource<Candidates>(this.data);
      this.dataSource.paginator = this.paginator;

      this.isLoading = false;
    });
  }

  selectData(data: any) {

    if (data === undefined) {
      return;
    }

    this.selectedId = data.id;

    this.candidateForm = new FormGroup({
      firstName: new FormControl(data.firstName || '', [Validators.required]),
      lastName: new FormControl(data.lastName || '', Validators.required),
      position: new FormControl(data.position || '', Validators.required),

      file: new FormControl(''),

      platform: new FormControl(data.platform || '', Validators.required),
      information: new FormControl(data.information || '', Validators.required),
    });
  }

  uploadFile(event: any) {
    this.isLoading = true;
    if (!this.candidateForm.valid && !this.file) {
      return console.log('not valid');
    }

    const storageRef = ref(this.storage, `candidates/${this.file.name}`);
    const upload = uploadBytesResumable(storageRef, this.file);

    upload.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        if (progress === 100) {
          setTimeout(() => {
            getDownloadURL(upload.snapshot.ref).then((url) => {
              this.createCandidate(url);
            });
          }, 2000);
        }
      },
      () => {
        getDownloadURL(upload.snapshot.ref).then((url) => {
        });
      }
    );
  }
  createCandidate(url: any) {
    let data = {
      firstName: this.candidateForm.value.firstName,

      lastName: this.candidateForm.value.lastName,
      photoUrl: url,
      platform: this.candidateForm.value.platform,
      position: this.candidateForm.value.position,
      information: this.candidateForm.value.information
    };
    const candidateInstance = collection(this.fireStore, 'candidates');

    addDoc(candidateInstance, data)
      .then((res: any) => {
        this.addToVotes(res.id);
      })
      .catch((err: any) => {
      });
  }

  addToVotes(data: any) {
    const votesInstance = collection(this.fireStore, 'votes');
    let votes = {
      candidate:
        this.candidateForm.value.firstName +
        ' ' +
        this.candidateForm.value.lastName,

      candidateId: data,
      position: this.candidateForm.value.position,
      votes: [],
    };
    addDoc(votesInstance, votes)
      .then((res: any) => {
        this.selectedFile = '';
        this.toastr.success('Candidate Updated Successfully!');
        this.ngAfterViewInit();
        this.isLoading = false;
      })
      .catch((err: any) => {
      });
  }

  updateCandidate() {
    this.isLoading = true;

    let data = {
      firstName: this.candidateForm.value.firstName,

      lastName: this.candidateForm.value.lastName,
      platform: this.candidateForm.value.platform,
      position: this.candidateForm.value.position,
      information: this.candidateForm.value.information
    };
    const updateInstance = doc(this.fireStore, 'candidates', this.selectedId);
    updateDoc(updateInstance, data)
      .then((res: any) => {
        this.updateToVotes();
      })
      .catch((err: any) => {
      });
  }

  updateToVotes() {
    const dbInstance = collection(this.fireStore, 'votes');
    const votesQuery = query(
      dbInstance,
      where('candidateId', '==', this.selectedId)
    );
    getDocs(votesQuery).then((res: any) => {
      const data = [
        ...res.docs.map((docRes: any) => {
          return { ...docRes.data(), id: docRes.id };
        }),
      ];
      const votesInstance = doc(this.fireStore, 'votes', data[0]?.id);
      let votes = {
        candidate:
          this.candidateForm.value.firstName +
          ' ' +
          this.candidateForm.value.lastName,

        position: this.candidateForm.value.position,
        votes: [],
      };
      updateDoc(votesInstance, votes)
        .then((res: any) => {
          this.isLoading = false;
          this.toastr.success('Candidate Updated Successfully!');
          this.selectedId = '';
          this.getData();
        })
        .catch((err: any) => {
        });
    });
  }

  deleteCandidate(id: any) {
    this.isLoading = true;

    const dbInstance = collection(this.fireStore, 'votes');
    const deleteInstance = doc(this.fireStore, 'candidates', id);

    deleteDoc(deleteInstance).then((res: any) => {

      const votesQuery = query(dbInstance, where('candidateId', '==', id));
      getDocs(votesQuery)
        .then((res: any) => {
          const data = [
            ...res.docs.map((docRes: any) => {
              return { ...docRes.data(), id: docRes.id };
            }),
          ];
          const votesInstance = doc(this.fireStore, 'votes', data[0].id);

          deleteDoc(votesInstance)
            .then((res: any) => {
              this.isLoading = false;
              this.toastr.success('Candidate Updated Successfully!');
              this.selectedId = '';
              this.getData();
            })
            .catch((err: any) => {
              this.isLoading = false;
              this.toastr.error('Candidate Updating Failed!');
              this.selectedId = '';
              this.getData();
            });
        })
        .catch((err: any) => {
        });
    });
  }
}

export interface Candidates {
  firstName?: string;
  id?: string;
  lastName?: string;
  photoUrl?: string;
  platform?: string;
  position?: string;
}
