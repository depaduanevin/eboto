import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  collection,
  Firestore,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-voter-login',
  templateUrl: './voter-login.component.html',
  styleUrls: ['./voter-login.component.scss'],
})
export class VoterLoginComponent implements OnInit {
  public loginForm: FormGroup = new FormGroup({});

  isLoading: boolean = false;
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private firestore: Firestore,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }
  buildForm() {
    this.loginForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      votersId: new FormControl('', [Validators.required]),
    });
  }

  errorToast(message: any) {
    this.toastr.error('Hello world!', 'Toastr fun!');
  }
  // onSubmit() {
  //   const a = { name: 'marc' };

  //   const b = a;

  //   a.name = 'test';

  //   console.log(a);
  //   console.log(b);
  // }

  onSubmit() {
    this.isLoading = true;

    if (this.loginForm.valid) {
      try {
        const dbInstance = collection(this.firestore, 'users');
        const q = query(
          dbInstance,
          where('srCode', '==', this.loginForm.value.votersId)
        );

        getDocs(q).then((res: any) => {
          const data = [
            ...res.docs.map((doc: any) => {
              return { ...doc.data(), id: doc.id };
            }),
          ];
          this.isLoading = false;

          signInWithEmailAndPassword(
            this.auth,
            data[0].email,
            this.loginForm.value.password
          )
            .then((res: any) => {
              console.log(res);
              localStorage.setItem('uid', res.user.uid);
              localStorage.setItem('token', res.user.accessToken);

              localStorage.setItem('email', res.user.email);
              localStorage.setItem('displayName', res.user.displayName);
              this.toastr.success('Login Sucessfully!');
              this.router.navigate(['voting-system']);
              this.isLoading = false;
            })
            .catch((err: any) => {
              console.log(err);
              this.toastr.error(err.code);

              this.isLoading = false;
            });
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      this.loginForm.markAllAsTouched();
      this.loginForm.reset();

      this.isLoading = false;
      this.toastr.error('Please fill up all the fields!');
    }
  }

  showPassword(password: any) {
    password.type = password.type === 'password' ? 'text' : 'password';
  }
}
