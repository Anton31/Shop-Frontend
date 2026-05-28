import {ChangeDetectionStrategy, Component, Inject, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class RegisterComponent {

  title = signal('');
  hidePassword = signal(true);

  constructor(public dialogRef: MatDialogRef<RegisterComponent>,
              @Inject(MAT_DIALOG_DATA) public data: UserDialogData) {
    if (data.new) {
      this.title.set('register');
    } else {
      this.title.set('change password');
    }
  }

  get username() {
    return this.data.userForm.get('username')!;
  }

  get email() {
    return this.data.userForm.get('email')!;
  }

  get password() {
    return this.data.userForm.get('password')!;
  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword())
    event.preventDefault();
  }

  onNoClick() {
    this.dialogRef.close();
  }
}

export interface UserDialogData {
  userForm: FormGroup;
  new: boolean;
}

