import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.css'],
  standalone: false
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
