import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-add-type',
  templateUrl: './add-type.component.html',
  styleUrls: ['./add-type.component.css'],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class AddTypeComponent {
  title: string;

  constructor(public dialogRef: MatDialogRef<AddTypeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: TypeDialogData) {
    this.title = data.new ? 'Add type' : 'Edit type';
  }

  get name() {
    return this.data.typeForm.get('name')!;
  }

  onNoClick() {
    this.dialogRef.close();
  }
}

export interface TypeDialogData {
  typeForm: FormGroup;
  new: boolean;
}
