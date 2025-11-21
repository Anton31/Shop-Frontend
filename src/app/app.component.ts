import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs";
import {UserInfo} from "./dto/user-info";
import {AuthService} from "./service/auth-service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RegisterComponent} from "./register/register.component";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserService} from "./service/user-service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {

  user!: Observable<UserInfo>;
  userForm!: FormGroup;
  username!: string;
  role!: string;

  constructor(private authService: AuthService,
              private userService: UserService,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
    this.authService.userSubject.subscribe(data => {
      this.username = data.username;
      this.role = data.role;
    })
  }

  login() {
    this.authService.login();
  }

  addUser() {
    this.userForm = this.fb.group({
      role: ['user'],
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
      username: [this.username],
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

  logout() {
    this.authService.logout();
  }

  ngOnInit(): void {
  }
}
