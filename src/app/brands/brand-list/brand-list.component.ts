import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from "../../service/product-service";
import {Brand} from "../../model/brand";
import {AddBrandComponent} from "../add-brand/add-brand.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {DeleteBrandComponent} from "../delete-brand/delete-brand.component";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSortModule, Sort} from "@angular/material/sort";
import {map, Observable, Subscription} from "rxjs";
import {AuthService} from "../../service/auth-service";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {AsyncPipe} from "@angular/common";


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
    MatSnackBarModule,
    AsyncPipe
  ]
})
export class BrandListComponent implements OnInit, OnDestroy {
  brands: Brand[] = [];
  brandForm!: FormGroup;
  displayedColumns: string[] = ['name', 'edit', 'delete'];
  currentDir = 'ASC';
  isLoggedIn!: Observable<boolean>;
  brandSubscription!: Subscription;

  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.isLoggedIn = this.authService.userSubject.pipe(map(value => value.role === 'admin'));
  }

  ngOnInit(): void {
    this.getBrands();
  }

  ngOnDestroy(): void {
    this.brandSubscription.unsubscribe();
  }

  getBrands() {
    this.brandSubscription = this.productService.getAllBrands('name', this.currentDir)
      .subscribe(data => {
        this.brands = data;
      });
  }

  sortBrands(sortState: Sort) {
    this.currentDir = sortState.direction;
    this.getBrands();
  }

  reset() {
    this.currentDir = 'ASC';
  }

  addBrand() {
    this.brandForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
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
            this.getBrands();
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
      name: [brand.name, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
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
            this.getBrands();
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
            this.getBrands();
          }, error: (error) => {
            this.snackBar.open(error.error.message, '', {duration: 3000})
          }
        });
      }
    });
  }
}
