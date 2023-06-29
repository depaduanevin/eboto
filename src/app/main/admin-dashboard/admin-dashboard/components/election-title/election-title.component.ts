import { Component, OnInit } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
@Component({
  selector: 'app-election-title',
  templateUrl: './election-title.component.html',
  styleUrls: ['./election-title.component.scss'],
})
export class ElectionTitleComponent implements OnInit {
  openEditPanel: boolean = false;

  title: any = [];
  isEnabled: boolean = false;
  titleChange: any;
  informationChange: any
  isLoading: boolean = false;
  form = this.formBuilder.group({
    title: [''],
    information: ['']
  });
  constructor(
    private toastr: ToastrService, 
    private fireStore: Firestore,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getInformation();
  }

  openEditModal() {
    this.openEditPanel = true;
  }
  closeEditModal() {
    this.openEditPanel = false;
  }

  getInformation() {
    this.isLoading = true;
    const dbInstance = collection(this.fireStore, 'election_title');
    getDocs(dbInstance)
      .then((res: any) => {
        this.title = [
          ...res.docs.map((doc: any) => {
            return { ...doc.data(), id: doc.id };
          }),
        ];
        this.isLoading = false;
        this.form.patchValue({
          title: this.title[0]?.title,
          information: this.title[0]?.information
        });
        this.isEnabled = this.title[0]?.isEnabled;
      })
      .catch((err: any) => {
      });
  }
  updateTitle(value: any) {
    this.isLoading = true;

    const updatedoc = doc(this.fireStore, 'election_title', this.title[0]?.id);
    updateDoc(updatedoc, value)
      .then((res: any) => {
        this.toastr.success('Success', 'information updated');

        this.ngOnInit();
        this.isLoading = false;

        this.closeEditModal();
      })
      .catch((err: any) => {
      });
  }

  onSave() {
    this.updateTitle(this.form.value);
  }
  onEnableToggle() {
    this.isEnabled = !this.isEnabled;
    const data = {
      ...this.form.value,
      isEnabled: this.isEnabled
    }
    this.updateTitle(data);
  }
}
