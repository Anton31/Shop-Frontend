import {Component, inject, Signal, signal} from '@angular/core';
import {Type} from "../../model/type";
import {ProductService} from "../../service/product-service";
import {AddTypeComponent} from "../add-type/add-type.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {DeleteTypeComponent} from "../delete-type/delete-type.component";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSortModule, Sort} from "@angular/material/sort";
import {map} from "rxjs";
import {AuthService} from "../../service/auth-service";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {HttpResourceRef} from "@angular/common/http";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  styleUrls: ['./type-list.component.css'],
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatSnackBarModule
  ]
})
export class TypeListComponent {
  types: HttpResourceRef<any>;
  displayedColumns: string[] = ['name', 'edit', 'delete'];
  typeForm!: FormGroup;

  currentSort = signal('name');
  currentDir = signal('ASC');
  isAdmin: Signal<boolean>;

  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.types = this.productService.getAllTypes(this.currentSort, this.currentDir);
    this.isAdmin = toSignal(this.authService.userSubject.pipe(map(data => data.role === 'admin')),
      {initialValue: false});
  }

  sortTypes(sortState: Sort) {
    this.currentDir.set(sortState.direction);
    this.currentSort.set(sortState.active);
  }

  reset() {
    this.currentSort.set('name');
    this.currentDir.set('ASC');
    this.types.reload();
  }

  addType() {
    this.typeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    })
    this.dialog.open(AddTypeComponent, {
      height: '500px',
      width: '500px',
      data: {
        typeForm: this.typeForm, new: true
      }
    }).afterClosed().subscribe(data => {
      if (data) {
        this.productService.addType(data).subscribe({
          next: () => {
            this.reset();
          },
          error: (err) => {
            this.snackBar.open(err.error.message, '', {duration: 3000})
          }
        });
      }
    });
  }

  editType(type: Type) {
    this.typeForm = this.fb.group({
      id: [type.id],
      name: [type.name, [Validators.required, Validators.minLength(3)]]
    })
    this.dialog.open(AddTypeComponent, {
      height: '500px',
      width: '500px',
      data: {
        typeForm: this.typeForm, new: false
      }
    }).afterClosed().subscribe(data => {
      if (data) {
        this.productService.editType(data).subscribe({
          next: () => {
            this.reset();
          },
          error: (err) => {
            this.snackBar.open(err.error.message, '', {duration: 3000})
          }
        });
      }
    });
  }

  deleteType(type: Type) {
    this.dialog.open(DeleteTypeComponent, {
      height: '500px',
      width: '500px',
      data: {
        type: type
      }
    }).afterClosed().subscribe(data => {
      if (data) {
        this.productService.deleteType(data).subscribe({
          next: () => {
            this.reset();
          },
          error: (err) => {
            this.snackBar.open(err.error.message, '', {duration: 3000})
          }
        });
      }
    });
  }
}
