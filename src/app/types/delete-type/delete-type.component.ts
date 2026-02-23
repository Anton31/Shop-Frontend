import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Type} from "../../model/type";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-delete-type',
  templateUrl: './delete-type.component.html',
  styleUrls: ['./delete-type.component.css'],
  imports: [
    MatDialogModule,
    MatButtonModule
  ]
})
export class DeleteTypeComponent {
  title = '';
  id = 0;

  constructor(public dialogRef: MatDialogRef<DeleteTypeComponent>,
              @Inject(MAT_DIALOG_DATA) data: DeleteTypeData) {
    this.title = 'delete ' + data.type.name + '?';
    this.id = data.type.id;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface DeleteTypeData {
  type: Type;
}
