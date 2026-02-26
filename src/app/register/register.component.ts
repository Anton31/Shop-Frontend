import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule
  ]
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

