import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Brand} from "../../model/brand";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-delete-brand',
  templateUrl: './delete-brand.component.html',
  styleUrls: ['./delete-brand.component.css'],
  imports: [
    MatDialogModule,
    MatButtonModule
  ]
})
export class DeleteBrandComponent {
  title = '';
  id = 0;

  constructor(public dialogRef: MatDialogRef<DeleteBrandComponent>,
              @Inject(MAT_DIALOG_DATA) data: DeleteBrandData) {
    this.title = 'delete ' + data.brand.name + '?';
    this.id = data.brand.id;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface DeleteBrandData {
  brand: Brand;
}
