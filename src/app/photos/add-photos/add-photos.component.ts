import {Component, Inject} from '@angular/core';
import {ProductService} from "../../service/product-service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Product} from "../../model/product";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-add-photos',
  standalone: false,
  templateUrl: './add-photos.component.html',
  styleUrl: './add-photos.component.css'
})
export class AddPhotosComponent {
  title = '';

  constructor(private productService: ProductService,
              public dialogRef: MatDialogRef<AddPhotosComponent>,
              @Inject(MAT_DIALOG_DATA) public data: AddPhotosDialogData) {
    this.title = 'add photos for product ' + data.product.name + '?';
  }

  handleUpload(event: any) {
    const file = event.target.files;
    this.productService.setFiles(file);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface AddPhotosDialogData {
  photoForm: FormGroup;
  product: Product;
}
