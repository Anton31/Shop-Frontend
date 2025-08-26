import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Photo} from "../../model/photo";

@Component({
  selector: 'app-delete-photo',
  standalone: false,
  templateUrl: './delete-photo.component.html',
  styleUrl: './delete-photo.component.css'
})
export class DeletePhotoComponent {
  title = '';
  photo: Photo;

  constructor(private dialogRef: MatDialogRef<DeletePhotoComponent>,
              @Inject(MAT_DIALOG_DATA) data: DeletePhotoData) {
    this.title = 'delete photo: ' + data.photo.name + '?';
    this.photo = data.photo;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface DeletePhotoData {
  photo: Photo;
}

