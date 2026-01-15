import {Component, inject, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ProductService} from "../../service/product-service";
import {Brand} from "../../model/brand";
import {Type} from "../../model/type";
import {FormGroup} from "@angular/forms";
import {DialogRef} from "@angular/cdk/dialog";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  standalone: false
})
export class AddProductComponent implements OnInit, OnDestroy {
  title: string;
  types!: Type[];
  brands!: Brand[];
  productForm: FormGroup;
  typeSubscription!: Subscription;
  brandSubscription!: Subscription;

  private productService = inject(ProductService);
  private dialogRef = inject(DialogRef);

  constructor(@Inject(MAT_DIALOG_DATA) public data: ProductDialogData) {
    if (data.new) {
      this.title = 'Add product'
    } else {
      this.title = 'Edit product'
    }
    this.productForm = data.productForm;
  }


  get name() {
    return this.productForm.get('name')!;
  }

  getTypes() {
    this.typeSubscription = this.productService.getAllTypes('name', 'ASC').subscribe(data => {
      this.types = data;
    });
  }

  getBrands() {
    this.brandSubscription = this.productService.getAllBrands('name', 'ASC').subscribe(data => {
      this.brands = data;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.getTypes();
    this.getBrands();
  }

  ngOnDestroy(): void {
    this.typeSubscription.unsubscribe();
    this.brandSubscription.unsubscribe();
  }
}

export interface ProductDialogData {
  productForm: FormGroup;
  new: boolean;
}
