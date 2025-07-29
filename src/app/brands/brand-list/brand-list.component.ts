import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../service/productService";
import {Brand} from "../../model/brand";
import {AddBrandComponent} from "../add-brand/add-brand.component";
import {MatDialog} from "@angular/material/dialog";
import {DeleteBrandComponent} from "../delete-brand/delete-brand.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../service/userService";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Sort} from "@angular/material/sort";

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css'],
  standalone: false
})
export class BrandListComponent implements OnInit {
  brands: Brand[] = [];
  brandForm!: FormGroup;
  displayedColumns: string[] = ['name', 'edit', 'delete'];
  role!: string | null;
  currentSort: string | undefined = undefined;
  currentDir: string | undefined = undefined;

  constructor(private userService: UserService,
              private productService: ProductService,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  getRole() {
    this.role = this.userService.fetchRole();
  }

  sortBrands(sortState: Sort) {
    this.currentSort = sortState.active;
    this.currentDir = sortState.direction;
    this.getBrands();
  }

  getBrands() {
    this.productService.getAllBrands(0, this.currentDir, this.currentSort)
      .subscribe(data => {
        this.brands = data;
      });
  }

  reset() {
    this.currentDir = undefined;
    this.currentSort = undefined;
  }

  addBrand() {
    this.brandForm = this.fb.group({
      id: [0],
      name: ['']
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
    this.getRole();
    this.getBrands();
  }
}
