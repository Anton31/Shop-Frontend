import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Product} from "../../model/product";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.css'],
  imports: [
    MatButtonModule,
    MatDialogModule
  ]
})
export class DeleteProductComponent {
  title = '';
  id = 0;

  constructor(private dialogRef: MatDialogRef<DeleteProductComponent>,
              @Inject(MAT_DIALOG_DATA) data: DeleteProductData) {
    this.title = 'delete product with name: ' + data.product.name + ' ?';
    this.id = data.product.id;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface DeleteProductData {
  product: Product;
}
