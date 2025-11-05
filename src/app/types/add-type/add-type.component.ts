import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormGroup} from "@angular/forms";
import {ProductService} from "../../service/product-service";
import {Brand} from "../../model/brand";

@Component({
  selector: 'app-add-type',
  templateUrl: './add-type.component.html',
  styleUrls: ['./add-type.component.css'],
  standalone: false
})
export class AddTypeComponent implements OnInit {
  title: string;
  brands!: Brand[];

  constructor(private service: ProductService,
              public dialogRef: MatDialogRef<AddTypeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: TypeDialogData
  ) {
    this.title = data.new ? 'Add type' : 'Edit type';
  }

  onNoClick() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.service.getTypeBrands(0, 'id', 'ASC').subscribe(data => {
      this.brands = data;
    })
  }
}

export interface TypeDialogData {
  typeForm: FormGroup;
  new: boolean;
}
