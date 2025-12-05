import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from "../../service/product-service";
import {Brand} from "../../model/brand";
import {AddBrandComponent} from "../add-brand/add-brand.component";
import {MatDialog} from "@angular/material/dialog";
import {DeleteBrandComponent} from "../delete-brand/delete-brand.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../service/auth-service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Sort} from "@angular/material/sort";
import {Subscription} from "rxjs";


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
  currentSort = 'name';
  currentDir = 'ASC';
  role!: string;
  subscription!: Subscription;

  constructor(private userService: AuthService,
              private productService: ProductService,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  sortBrands(sortState: Sort) {
    this.currentSort = sortState.active;
    this.currentDir = sortState.direction;
    this.getBrands();
  }

  getBrands() {
    this.productService.getAllBrands(this.currentSort, this.currentDir)
      .subscribe(data => {
        this.brands = data;
      });
  }

  reset() {
    this.currentDir = 'ASC';
    this.currentSort = 'name';
  }

  addBrand() {
    this.brandForm = this.fb.group({
      name: [''],
      typeId: [1]
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
      name: [brand.name]
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

  ngOnInit(): void {
    this.subscription = this.userService.userSubject.subscribe(data => {
      this.role = data.role;
    });
    this.getBrands();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
