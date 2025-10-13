import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Product} from "../../model/product";

@Component({
  selector: 'app-delete-photo',
  templateUrl: './delete-photos.component.html',
  styleUrls: ['./delete-photos.component.css'],
  standalone: false
})
export class DeletePhotosComponent {
  title = '';
  id = 0;

  constructor(private dialogRef: MatDialogRef<DeletePhotosComponent>,
              @Inject(MAT_DIALOG_DATA) data: DeletePhotosData) {
    this.title = 'delete photos for ' + data.product.name + '?';
    this.id = data.product.id;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface DeletePhotosData {
  product: Product;
}
