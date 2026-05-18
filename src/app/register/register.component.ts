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

  title: string;
  hide = signal(true);
  hide2 = signal(true);

  constructor(public dialogRef: MatDialogRef<RegisterComponent>,
              @Inject(MAT_DIALOG_DATA) public data: UserDialogData) {
    if (data.new) {
      this.title = 'register'
    } else {
      this.title = 'change password';
    }
  }

  get username() {
    return this.data.userForm.get('username')!;
  }

  get email() {
    return this.data.userForm.get('email')!;
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide())
    event.preventDefault();
  }

  clickEvent2(event: MouseEvent) {
    this.hide2.set(!this.hide2())
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

