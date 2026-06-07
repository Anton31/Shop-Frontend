import {Component, inject, Signal} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../service/auth-service";
import {UserService} from "../service/user-service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RegisterComponent} from "../register/register.component";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {toSignal} from "@angular/core/rxjs-interop";
import {UserInfo} from "../dto/user-info";

@Component({
  selector: 'app-login',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent {
  userForm!: FormGroup;
  user: Signal<UserInfo>;

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.user = toSignal(this.authService.userSubject, {initialValue: new UserInfo('', '', '')});
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  addUser() {
    this.userForm = this.fb.group({
      role: ['user'],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4),
        Validators.pattern('^(?=.*[0-9])(?=.*[A-Z]).{2,}$')]],
      passwordConfirmed: [''],
    })
    this.dialog.open(RegisterComponent, {
      height: '600px',
      width: '500px',
      data: {userForm: this.userForm, new: true}
    }).afterClosed().subscribe(data => {
      if (data) {
        this.userService.addUser(data).subscribe({
          next: (data2) => {
            this.snackBar.open(data2.message, '', {duration: 3000})
          },
          error: (err) => {
            this.snackBar.open(err.error.message, '', {duration: 3000})
          }
        });
      }
    });
  }

  editUser() {
    this.userForm = this.fb.group({
      role: [this.user().role],
      username: [this.user().username],
      email: [this.user().email],
      password: ['', [Validators.required, Validators.minLength(4),
        Validators.pattern('^(?=.*[0-9])(?=.*[A-Z]).{2,}$')]],
      passwordConfirmed: [''],
    })
    this.dialog.open(RegisterComponent, {
      height: '600px',
      width: '500px',
      data: {userForm: this.userForm, new: false}
    }).afterClosed().subscribe(data => {
      this.userService.editUser(data).subscribe({
        next: (data2) => {
          this.snackBar.open(data2.message, '', {duration: 3000})
        },
        error: (err) => {
          this.snackBar.open(err.error.message, '', {duration: 3000})
        }
      });
    });
  }
}
