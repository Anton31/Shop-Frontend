import {Component, OnDestroy} from '@angular/core';
import {Type} from "../../model/type";
import {ProductService} from "../../service/product-service";
import {AddTypeComponent} from "../add-type/add-type.component";
import {MatDialog} from "@angular/material/dialog";
import {DeleteTypeComponent} from "../delete-type/delete-type.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Sort} from "@angular/material/sort";
import {map, Observable, Subscription} from "rxjs";
import {AuthService} from "../../service/auth-service";

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  styleUrls: ['./type-list.component.css'],
  standalone: false
})
export class TypeListComponent implements OnDestroy {
  types: Type[] = [];
  displayedColumns: string[] = ['name', 'brands', 'edit', 'delete'];
  typeForm!: FormGroup;
  currentSort = 'name';
  currentDir = 'ASC';
  isLoggedIn: Observable<boolean>;
  subscription!: Subscription;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) {
    this.isLoggedIn = this.authService.userSubject.pipe(map(data => data.sub === 'Igor'));
    this.getTypes();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  sortTypes(sortState: Sort) {
    this.currentDir = sortState.direction;
    this.currentSort = sortState.active;
    this.getTypes();
  }

  reset() {
    this.currentSort = 'name';
    this.currentDir = 'ASC';
  }

  getTypes() {
    this.subscription = this.productService.getAllTypes(this.currentSort, this.currentDir)
      .subscribe(data => {
        this.types = data;
      });
  }

  addType() {
    this.typeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
    })
    const dialogRef = this.dialog.open(AddTypeComponent, {
      height: '500px',
      width: '500px',
      data: {
        typeForm: this.typeForm, new: true
      }
    }).afterClosed().subscribe(data => {
      this.productService.addType(data).subscribe(data => {
          this.reset();
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
      name: [type.name, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
    })
    const dialogRef = this.dialog.open(AddTypeComponent, {
      height: '500px',
      width: '500px',
      data: {
        typeForm: this.typeForm, new: false
      }
    }).afterClosed().subscribe(data => {
      this.productService.editType(data).subscribe(data => {
        this.reset();
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
        this.reset();
        this.getTypes();
      }, error => {
        this.snackBar.open(error.error.message, '', {duration: 3000})
      });
    });
  }
}
