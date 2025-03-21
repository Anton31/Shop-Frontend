import {Component, OnInit} from '@angular/core';
import {Type} from "../../model/type";
import {ProductService} from "../../service/productService";
import {AddTypeComponent} from "../add-type/add-type.component";
import {MatDialog} from "@angular/material/dialog";
import {DeleteTypeComponent} from "../delete-type/delete-type.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../service/userService";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  styleUrls: ['./type-list.component.css']
})
export class TypeListComponent implements OnInit {
  types: Type[] = [];
  displayedColumns: string[] = ['name', 'edit', 'delete'];
  role!: string;
  typeForm!: FormGroup;

  constructor(private userService: UserService,
              private productService: ProductService,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private snackBar: MatSnackBar
  ) {
  }

  getRole() {
    this.role = this.userService.getRole();
  }

  getTypes() {
    this.productService.getAllTypes().subscribe(data => {
      this.types = data;
    });
  }

  addType() {
    this.typeForm = this.fb.group({
      id: [0],
      name: ['']
    })
    const dialogRef = this.dialog.open(AddTypeComponent, {
      height: '500px',
      width: '500px',
      data: {
        typeForm: this.typeForm, new: true
      }
    }).afterClosed().subscribe(data => {
      this.productService.addType(data).subscribe(data => {
          this.getTypes();
        },
        error => {
          this.snackBar.open(error.error.message, '', {duration: 3000})
        }
      )
    });
  }

  editType(type: Type) {
    this.typeForm = this.fb.group({
      id: [type.id],
      name: [type.name]
    })
    const dialogRef = this.dialog.open(AddTypeComponent, {
      height: '500px',
      width: '500px',
      data: {
        typeForm: this.typeForm, new: false
      }
    }).afterClosed().subscribe(data => {
      this.productService.editType(data).subscribe(data => {
        this.getTypes();
      }, error => {
        this.snackBar.open(error.error.message, '', {duration: 3000})
      });
    });
  }

  deleteType(type: Type) {
    const dialogRef = this.dialog.open(DeleteTypeComponent, {
      height: '500px',
      width: '500px',
      data: {
        type: type
      }
    }).afterClosed().subscribe(data => {
      this.productService.deleteType(data).subscribe(data => {
        this.getTypes();
      }, error => {
        this.snackBar.open(error.error.message, '', {duration: 3000})
      });
    });
  }

  ngOnInit(): void {
    this.getRole();
    this.getTypes();
  }
}
