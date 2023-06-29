import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { from, Observable } from 'rxjs';
@Component({
  selector: 'app-voters-side-page',
  templateUrl: './voters-side-page.component.html',
  styleUrls: ['./voters-side-page.component.scss'],
})
export class VotersSidePageComponent implements OnInit {
  @ViewChild('close') close: ElementRef<HTMLElement> | undefined;
  sampleVotes: any = [];

  title: Array<any> = [];

  positions: Array<any> = [];
  candidates: Array<any> = [];
  isEnabled: boolean = false;
  isLoading: boolean = false;
  userData: Array<any> = [];
  uid: any;
  selectedPosition: any;
  public updatePasswordForm: FormGroup = new FormGroup({});

  arrayOfCandidatesId: Array<any> = [];
  selectedCandidateId: any;
  abstain: any[] = [];
  selectedPositionArray: Array<any> = [];

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
    this.buildForm();
    this.getAbstain();

    window.scroll({
      top: 0,
    });
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

      if (this.userData[0]?.type === 'voted') {
        this.toastr.error('You are already voted!');

        this.isLoading = false;
        this.router.navigate(['vote-complete']);
      } else {
        if (!localStorage.getItem('first-login')) {
          localStorage.setItem('first-login', 'true');
          this.router.navigate(['election-information']);
        } else {
          if (localStorage.getItem('first-login') === 'true') {
            this.router.navigate(['election-information']);
          }
          return;
        }
      }
    });
  }

  buildForm() {
    this.updatePasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      votersId: new FormControl('', [Validators.required]),
    });
  }
  onChange(event: any) {
    console.log(event);
    // this.sampleVotes.push(event);

    // const arr: any = [];

    // this.sampleVotes.forEach((element: any) => {
    //   // if (!arr.includes(element)) {
    //   //   arr.push(element);
    //   // }
    //   if (event.position != element.position) {
    //     arr.push(element.name);
    //   }
    // });

    // console.log(arr);
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
        this.isEnabled = this.title[0]?.isEnabled ? true : false;
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
  getAbstain() {
    const dbInstance = collection(this.firestore, 'abstain_position');
    getDocs(dbInstance)
      .then((res: any) => {
        const abstain = [
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
        console.log(this.positions);
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

  updateVote(id: any, position: any) {
    this.selectedPositionArray.push(position);

    this.arrayOfCandidatesId.push(id);
    console.log(this.selectedPositionArray);
    console.log(this.arrayOfCandidatesId);
  }

  async submitVote(id: any) {
    
    this.isLoading = true;
    const uid = localStorage.getItem('uid');
    if (!uid) {
      this.toastr.error('Error', 'Please Login');
      return;
    }
    const getVotes = collection(this.firestore, 'votes');

    const promise = await new Promise((resolve, reject) => {
      this.arrayOfCandidatesId.forEach((res: any) => {
        const voterQuery = query(getVotes, where('candidateId', '==', res));
        getDocs(voterQuery).then((res: any) => {
          const candidates = [
            ...res.docs.map((doc: any) => {
              return { ...doc.data(), id: doc.id };
            }),
          ];
          let data = {
            votes: arrayUnion(uid),
          };
          const dbInstance = doc(this.firestore, 'votes', candidates[0].id);
          updateDoc(dbInstance, data)
            .then((res: any) => {
              if (this.abstain.length > 0) {
                this.submitAbstainVote(uid);
              }
              const votedInstance = doc(this.firestore, 'users', id);
              let data = {
                type: 'voted',
              };
              updateDoc(votedInstance, data)
                .then((res: any) => {
                  this.isLoading = false;
                  let el: HTMLElement | undefined = this.close?.nativeElement;
                  el?.click();
                  resolve('Succeded');
                })
                .catch((err: any) => {
                  console.log(err);
                  reject(err);
                });
            })
            .catch((err: any) => {
              console.log(err);
              reject(err);
            });
        });
      });
    });

    this.toastr.success('Vote Submitted');
    this.isLoading = false;
    this.router.navigate(['vote-complete']);

  }
  submitAbstainVote(uid: any) {
    const getAbstain = collection(this.firestore, 'abstain_position');
    const selectedPosition = this.positions.filter(x => {
      return this.abstain.includes(x.description);
    })
    selectedPosition.forEach((res: any) => {
      const abstainQuery = query(getAbstain, where('pid', '==', res.id));
      getDocs(abstainQuery).then((res: any) => {
        const abstains = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        let data = {
          count: arrayUnion(uid),
        };
        const dbInstance = doc(this.firestore, 'abstain_position', abstains[0].id);
        updateDoc(dbInstance, data)
          .then((res: any) => {
            this.isLoading = false;
          })
      })
    });
  }
  resetSpecific(id: any, position: any) {
    if (this.arrayOfCandidatesId.includes(id)) {

      this.selectedPosition = null;
      const pIndex = this.selectedPositionArray.indexOf(position);

      const index = this.arrayOfCandidatesId.indexOf(id);

      this.arrayOfCandidatesId.splice(index, 1);
      this.selectedPositionArray.splice(pIndex, 1);

      console.log(this.selectedPositionArray);
      console.log(this.arrayOfCandidatesId);
    } else {
      console.log('no');
    }
  }
  isVoteDisabled(maximumVote: number, position: any) {
    const selectedPosition = this.selectedPositionArray.filter(x => {
      return x === position;
    });
    return maximumVote === selectedPosition.length ? true : false;
  }
  resetAll(event: any) {
    event.checked = false;

    this.arrayOfCandidatesId = [];
  }
  abstainPosition(event: any, position: any) {
    if (event.target.checked === true) {
      this.abstain.push(position);
    } else {
      this.abstain = this.abstain.filter(x => x !== position);
    }
    console.log(this.abstain);
  }
  distinctArray(value: any) {
    const onlyUnique = (val: any, index: any, array: any) => {
      return array.indexOf(val) === index;
    }
    const unique = value.filter(onlyUnique);
    return unique;
  }
  check() {
    console.log(this.distinctArray(this.selectedPositionArray)) 
    
  }
  disableSubmit() {
    const distinctPosition = this.distinctArray(this.selectedPositionArray).length;
    const overAllSelected = distinctPosition + this.abstain.length;
    return overAllSelected !== this.positions.length ? true : false;
  }
}


