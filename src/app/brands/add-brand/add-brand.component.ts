import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.css'],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class AddBrandComponent {
  title: string;

  constructor(public dialogRef: MatDialogRef<AddBrandComponent>,
              @Inject(MAT_DIALOG_DATA) public data: BrandDialogData) {
    this.title = data.new ? 'Add brand' : 'Edit brand';
  }

  get name() {
    return this.data.brandForm.get('name')!;
  }

  onNoClick() {
    this.dialogRef.close();
  }
}

export interface BrandDialogData {
  brandForm: FormGroup;
  new: boolean;
}
