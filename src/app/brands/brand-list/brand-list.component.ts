import {Component, inject, Signal, signal} from '@angular/core';
import {ProductService} from "../../service/product-service";
import {Brand} from "../../model/brand";
import {AddBrandComponent} from "../add-brand/add-brand.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {DeleteBrandComponent} from "../delete-brand/delete-brand.component";
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
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css'],
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatSnackBarModule
  ]
})
export class BrandListComponent {
  brands!: HttpResourceRef<any>;
  brandForm!: FormGroup;
  displayedColumns: string[] = ['name', 'edit', 'delete'];

  currentSort = signal('name');
  currentDir = signal('ASC');
  isLoggedIn!: Signal<boolean>;

  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.brands = this.productService.getAllBrands(this.currentSort, this.currentDir);
    this.isLoggedIn = toSignal(this.authService.userSubject.pipe(map(value => value.role === 'admin')),
      {initialValue: false});
  }

  sortBrands(sortState: Sort) {
    this.currentDir.set(sortState.direction);
  }

  reset() {
    this.currentDir.set('ASC');
    this.brands.reload();
  }

  addBrand() {
    this.brandForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
    this.dialog.open(AddBrandComponent, {
      height: '500px',
      width: '500px',
      data: {
        brandForm: this.brandForm, new: true
      }
    }).afterClosed().subscribe(data => {
      if (data) {
        this.productService.addBrand(data).subscribe({
          next: () => {
            this.reset();
          },
          error: (error) => {
            this.snackBar.open(error.error.message, '', {duration: 3000})
          }
        });
      }
    });
  }

  editBrand(brand: Brand) {
    this.brandForm = this.fb.group({
      id: [brand.id],
      name: [brand.name, [Validators.required, Validators.minLength(3)]]
    })
    this.dialog.open(AddBrandComponent, {
      height: '500px',
      width: '500px',
      data: {
        brandForm: this.brandForm, new: false
      }
    }).afterClosed().subscribe(data => {
      if (data) {
        this.productService.editBrand(data).subscribe({
          next: () => {
            this.reset();
          },
          error: (error) => {
            this.snackBar.open(error.error.message, '', {duration: 3000})
          }
        });
      }
    });
  }

  deleteBrand(brand: Brand) {
    this.dialog.open(DeleteBrandComponent, {
      height: '500px',
      width: '500px',
      data: {
        brand: brand
      }
    }).afterClosed().subscribe(data => {
      if (data) {
        this.productService.deleteBrand(data).subscribe({
          next: () => {
            this.reset();
          }, error: (error) => {
            this.snackBar.open(error.error.message, '', {duration: 3000})
          }
        });
      }
    });
  }
}
