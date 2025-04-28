import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ProductService} from "../../service/productService";
import {Brand} from "../../model/brand";
import {Type} from "../../model/type";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  standalone: false
})
export class AddProductComponent implements OnInit {
  title: string;
  types!: Type[];
  brands!: Brand[];
  selectedType!: number;
  selectedBrand!: number;
  constructor(public productService: ProductService,
              public dialogRef: MatDialogRef<AddProductComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ProductDialogData) {
    if (data.new) {
      this.title = 'Add product'
    } else {
      this.title = 'Edit product'
    }
  }

  getTypes() {
    this.productService.getAllTypes('ASC', 'id').subscribe(data => {
      this.types = data;
      this.selectedType = this.types[0].id;
    });
  }
  getBrands(){
    this.productService.getAllBrands(undefined, 'ASC', 'id').subscribe(data => {
      this.brands = data;

    });
  }
  selectBrands(event: any) {
    this.selectedType = event.value;
    this.productService.getAllBrands(this.selectedType, 'ASC', 'id').subscribe(data => {
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
}

export interface ProductDialogData {
  productForm: FormGroup;
  new: boolean;
}
