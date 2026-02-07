import {Component, inject} from "@angular/core";


import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RegisterComponent} from "./register/register.component";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserService} from "./service/user-service";

import {UserInfo} from "./dto/user-info";
import {Observable} from "rxjs";
import {AuthService} from "./service/auth-service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {
  userForm!: FormGroup;
  user!: Observable<UserInfo>;

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.user = this.authService.userSubject.pipe();
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  addUser() {
    this.userForm = this.fb.group({
      role: ['admin'],
      username: [''],
      email: [''],
      password: [''],
      passwordConfirmed: [''],
    })
    const dialogRef = this.dialog.open(RegisterComponent, {
      height: '500px',
      width: '500px',
      data: {userForm: this.userForm, new: true}
    }).afterClosed().subscribe(data => {
      this.userService.addUser(data).subscribe(data2 => {
          this.snackBar.open(data2.message, '', {duration: 3000})
        },
        err => {
          this.snackBar.open(err.error.message, '', {duration: 3000})
        })
    })
  }

  editUser() {
    this.userForm = this.fb.group({
      password: [''],
      passwordConfirmed: [''],
    })
    const dialogRef = this.dialog.open(RegisterComponent, {
      height: '500px',
      width: '500px',
      data: {userForm: this.userForm, new: false}
    }).afterClosed().subscribe(data => {
      this.userService.editUser(data).subscribe(data2 => {
          this.snackBar.open(data2.message, '', {duration: 3000})
        },
        err => {
          this.snackBar.open(err.error.message, '', {duration: 3000})
        })
    })
  }
}
