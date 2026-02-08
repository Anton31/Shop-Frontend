import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from "../../service/product-service";
import {Brand} from "../../model/brand";
import {AddBrandComponent} from "../add-brand/add-brand.component";
import {MatDialog} from "@angular/material/dialog";
import {DeleteBrandComponent} from "../delete-brand/delete-brand.component";
import {MatSnackBar} from "@angular/material/snack-bar";

import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Sort} from "@angular/material/sort";
import {map, Observable, Subscription} from "rxjs";
import {AuthService} from "../../service/auth-service";


@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css'],
  standalone: false
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
    const dialogRef = this.dialog.open(AddBrandComponent, {
      height: '500px',
      width: '500px',
      data: {
        brandForm: this.brandForm, new: true
      }
    }).afterClosed().subscribe(data => {
      this.productService.addBrand(data).subscribe(data => {
          this.reset();
          this.getBrands();
        },
        error => {
          this.snackBar.open(error.error.message, '', {duration: 3000})
        }
      )
    });
  }

  editBrand(brand: Brand) {
    this.brandForm = this.fb.group({
      id: [brand.id],
      name: [brand.name, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
    })
    const dialogRef = this.dialog.open(AddBrandComponent, {
      height: '500px',
      width: '500px',
      data: {
        brandForm: this.brandForm, new: false
      }
    }).afterClosed().subscribe(data => {
      this.productService.editBrand(data).subscribe(data => {
          this.reset();
          this.getBrands();
        },
        error => {
          this.snackBar.open(error.error.message, '', {duration: 3000})
        })
    })
  }

  deleteBrand(brand: Brand) {
    const dialogRef = this.dialog.open(DeleteBrandComponent, {
      height: '500px',
      width: '500px',
      data: {
        brand: brand
      }
    }).afterClosed().subscribe(data => {
      this.productService.deleteBrand(data).subscribe(data => {
          this.reset();
          this.getBrands();
        }, error => {
          this.snackBar.open(error.error.message, '', {duration: 3000})
        }
      )
    })
  }
}
