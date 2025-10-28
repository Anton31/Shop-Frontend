import {Component, OnInit} from "@angular/core";
import {UserDto} from "./dto/user-dto";
import {Observable} from "rxjs";
import {UserInfo} from "./dto/user-info";
import {UserService} from "./service/user-service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RegisterComponent} from "./register/register.component";
import {FormBuilder, FormGroup} from "@angular/forms";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  dto: UserDto;
  user!: Observable<UserInfo>;
  userForm!: FormGroup;

  constructor(private userService: UserService,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
    this.dto = new UserDto('', '', '', '', '');
    this.user = this.userService.userSubject.pipe();
  }

  login1() {
    this.userService.login1();
  }

  login2() {
    this.userService.login2();
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
          this.snackBar.open(data2.message, 'undo', {duration: 3000})
        },
        err => {
          this.snackBar.open(err.error.message, 'undo', {duration: 3000})
        })
    })
  }

  editUser() {
    let username = this.userService.fetchUsername();
    this.userForm = this.fb.group({
      username: [username],
      password: [''],
      passwordConfirmed: [''],
    })
    const dialogRef = this.dialog.open(RegisterComponent, {
      height: '500px',
      width: '500px',
      data: {userForm: this.userForm, new: false}
    }).afterClosed().subscribe(data => {
      this.userService.editUser(data).subscribe(data2 => {
          this.snackBar.open(data2.message, 'undo', {duration: 3000})
        },
        err => {
          this.snackBar.open(err.error.message, 'undo', {duration: 3000})
        })
    })
  }

  logout() {
    this.userService.logout();
  }

  ngOnInit(): void {
    this.userService.getAuthCode();
  }
}
