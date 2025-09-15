import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent {

  title: string;

  constructor(public dialogRef: MatDialogRef<RegisterComponent>,
              @Inject(MAT_DIALOG_DATA) public data: UserDialogData) {
    if (data.new) {
      this.title = 'register'
    } else {
      this.title = 'change password';
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }
}

export interface UserDialogData {
  userForm: FormGroup;
  new: boolean;
}

