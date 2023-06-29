import { Component, OnInit } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  Storage,
} from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-voter-registration',
  templateUrl: './voter-registration.component.html',
  styleUrls: ['./voter-registration.component.scss'],
})
export class VoterRegistrationComponent implements OnInit {
  public votersForm: FormGroup = new FormGroup({});

  isLoading: boolean = false;
  file!: File;
  fileRestriction: Array<any> = ['image/jpeg', 'image/png'];
  isFileValid: boolean = true;
  positions: Array<any> = [];
  constructor(
    private fireStore: Firestore,
    private toastr: ToastrService,
    private storage: Storage,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }
  buildForm() {
    this.votersForm = new FormGroup({
      lastName: new FormControl('', [Validators.required]),
      firstName: new FormControl('', Validators.required),
      file: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      contactNumber: new FormControl('', Validators.required),
      srCode: new FormControl('', Validators.required),

      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    return;
  }

  showPassword(password: any) {
    password.type = password.type === 'password' ? 'text' : 'password';
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
              console.log(url);
              this.register(url);
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
      srCode: this.votersForm.value.srCode,
    };
    let usersData = {
      email: this.votersForm.value.email,

      name:
        this.votersForm.value.firstName + ' ' + this.votersForm.value.lastName,
      password: this.votersForm.value.password,
      type: 'voter',
      uid: createUser.user.uid,
      username: this.votersForm.value.firstName,
      srCode: this.votersForm.value.srCode,
      accStatus: 'pending',
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
    this.toastr.success(
      'Registration Submitted',
      'Wait for the Account approval'
    );
    this.isLoading = false;

    this.votersForm.reset();
  }

  register(url: any) {
    const votersInstance = collection(this.fireStore, 'voters_information');
    const usersInstance = collection(this.fireStore, 'users');
    let votersData = {
      contactNumber: this.votersForm.value.contactNumber,
      status: 'pending',
      displayPictureUrl: url,
      email: this.votersForm.value.email,
      firstName: this.votersForm.value.firstName,
      lastName: this.votersForm.value.lastName,
      voterId: '',
      srCode: this.votersForm.value.srCode,
    };
    let usersData = {
      email: this.votersForm.value.email,

      name:
        this.votersForm.value.firstName + ' ' + this.votersForm.value.lastName,
      password: this.votersForm.value.password,
      type: 'voter',
      uid: '',
      username: this.votersForm.value.firstName,
      srCode: this.votersForm.value.srCode,
      accStatus: 'pending',
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
    this.toastr.success(
      'Registration Submitted',
      'Wait for the Account approval'
    );
    this.isLoading = false;
    this.router.navigate(['voter-login']);

    this.votersForm.reset();
  }
}
