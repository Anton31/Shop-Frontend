import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Photo} from "../../model/photo";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-delete-photo',
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-photo.component.html',
  styleUrl: './delete-photo.component.css'
})
export class DeletePhotoComponent {
  title = '';
  photo: Photo;

  constructor(private dialogRef: MatDialogRef<DeletePhotoComponent>,
              @Inject(MAT_DIALOG_DATA) data: DeletePhotoData) {
    this.title = 'delete photo: ' + data.photo.fileName + '?';
    this.photo = data.photo;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface DeletePhotoData {
  photo: Photo;
}

