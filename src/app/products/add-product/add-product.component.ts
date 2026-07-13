import {Component, inject, Inject, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {ProductService} from "../../service/product-service";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DialogRef} from "@angular/cdk/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {HttpResourceRef} from "@angular/common/http";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  imports: [
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class AddProductComponent {
  title: string;

  types!: HttpResourceRef<any>;
  brands!: HttpResourceRef<any>;

  currentSort = signal('name');
  currentDir = signal('ASC');

  productForm: FormGroup;

  private productService = inject(ProductService);
  private dialogRef = inject(DialogRef);

  constructor(@Inject(MAT_DIALOG_DATA) public data: ProductDialogData) {
    if (data.new) {
      this.title = 'Add product'
    } else {
      this.title = 'Edit product'
    }
    this.productForm = data.productForm;

    this.types = this.productService.getAllTypes(this.currentSort, this.currentDir);
    this.brands = this.productService.getAllBrands(this.currentSort, this.currentDir);
  }

  get name() {
    return this.productForm.get('name')!;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface ProductDialogData {
  productForm: FormGroup;
  new: boolean;
}
